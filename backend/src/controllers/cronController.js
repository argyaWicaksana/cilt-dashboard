const { Sequelize } = require('sequelize');
const moment = require("moment");
const { db, sequelizeInstances } = require("../../config/sequelize");
const aio_iot = [
    sequelizeInstances.aio_iot_oci1,
    sequelizeInstances.aio_iot_oci2,
    sequelizeInstances.aio_iot_fsb,
];

async function scheduler(areaId) {
    try {
        const query = `
                SELECT id, created_date
                FROM mst_prodidentity 
                WHERE cycle_type = 'end_cycle'
                ORDER BY id DESC 
                LIMIT 1
            `;

        const identity = await aio_iot[areaId - 1].query(query, {
            type: QueryTypes.SELECT,
        });

        if (identity.length > 0) {
            console.log('insert cycle area', areaId, identity[0].id)
            await closeCurrCycle(areaId, identity[0].id);
            const nextCycle = await getNextCycle(areaId);
            const cycleData = await insertCycle(nextCycle, areaId, identity[0].id);
            await insertTrCheck(cycleData)
            await sendReminder();
        }
    } catch (e) {
        console.log('Error', e.message);
    }
}


async function getNextCycle(areaId) {
    try {
        console.log('check last cycle and note cycle...')
        const currentYear = new Date().getFullYear();
        const lastCycleThisYear = await db.sms.mst_cycle.findOne({
            attributes: ['id', 'cycle', 'start_date', 'end_date'],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('year', Sequelize.col('start_date')), currentYear),
                    { area_id: areaId }
                ]
            },
            order: [['end_date', 'desc']]
        });

        let nextCycle = 1;

        if (lastCycleThisYear) {
            nextCycle = parseInt(lastCycleThisYear.cycle.split(' ')[1]) + 1;
        }

        return nextCycle;
    } catch (e) {
        throw e;
    }
}

async function closeCurrCycle(areaId, identityId = 0) {
    try {
        console.log('close curr cycle', areaId);

        const currCycle = await db.sms.mst_cycle.findOne({
            attributes: { exclude: ['area_id'] },
            where: {
                end_date: null,
                area_id: areaId
            }
        });

        if (!currCycle) {
            throw new Error('Cant find current cycle!');
        }

        if (identityId <= currCycle.prodidentity_id) {
            throw new Error('Not time to create a new cycle yet!');
        }

        // update end_date
        currCycle.end_date = moment().format("YYYY-MM-DD HH:mm:ss");

        console.log('update curr cycle end_date');
        await currCycle.save();
    } catch (e) {
        throw e;
    }
}

async function insertCycle(cycle, areaId, identityId = 0) {
    try {
        const date = moment().format('YYYY-MM-DD');

        const cycleNote = await db.sms.cycle_note.findOne({
            where: {
                area_id: areaId,
                start_date: {
                    [Sequelize.Op.lte]: date
                },
                end_date: {
                    [Sequelize.Op.gte]: date
                }
            }
        });

        console.log('insert new data cycle for area', areaId);
        const cycleData = await db.sms.mst_cycle.create({
            cycle: `Cycle ${cycle}`,
            area_id: areaId,
            ...(identityId === 0 ? {} : { prodidentity_id: identityId }),
            ...(cycleNote ? { reason_stop: cycleNote.reason_stop } : {}),
            start_date: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
        });

        // if its stop cycle, throw error to stop the program and prevent generating new task
        if (cycleNote) {
            throw new Error('there is no task for this cycle');
        }

        return cycleData;
    } catch (e) {
        throw e;
    }
}

async function insertTrCheck(cycleData) {
    try {
        console.log('increment/decrement current_week...');
        await db.sms.sequelize.query(`
            UPDATE mst_check mc
            JOIN mst_lokasi ml ON ml.id = mc.id_location
            SET mc.current_week = CASE
                WHEN mc.current_week >= mc.total_cycle THEN 1
                ELSE mc.current_week + 1
            END
            WHERE ml.id_area = ?`, {
            replacements: [cycleData.area_id]
        });

        // get master check where current_week equal total_cycle
        console.log('get master check data...');
        const masterCheck = await db.sms.mst_check.findAll({
            attributes: ['id'],
            where: {
                total_cycle: {
                    [Sequelize.Op.eq]: Sequelize.col('current_week')
                },
                '$mst_lokasi.mst_sub_section.mst_section.id_area$': cycleData.area_id
            },
            include: {
                model: db.sms.mst_lokasi,
                attributes: [],
                include: {
                    model: db.sms.mst_sub_section,
                    attributes: [],
                    include: {
                        model: db.sms.mst_section,
                        attributes: [],
                    }
                }
            },
        });

        let trChecks = masterCheck.map(c => ({
            id_check: c.id,
            id_cycle: cycleData.id
        }));

        if (trChecks.length > 0) {
            console.log("insert tr check...");
            await db.sms.tr_check.bulkCreate(trChecks);
        }
    } catch (e) {
        throw e;
    }
}

async function sendReminder() {
}

exports.scheduleJobs = async () => {
    await scheduler(1);
    await scheduler(2);
    await scheduler(3);
}
