const { Sequelize } = require('sequelize');
const moment = require("moment");
const { Telegraf } = require("telegraf");
const response = require("../tools/response");
const dotenv = require("dotenv");
const path = require("path");
const { db, sequelizeInstances } = require("../../config/sequelize");

dotenv.config({ path: path.join(__dirname, "../../env/.env.dev") });
const aio_iot = [
    sequelizeInstances.aioIotOci1,
    sequelizeInstances.aioIotOci2,
    sequelizeInstances.aioIotFsb,
];
let currentCycle;
let transaction;
const bot = new Telegraf(process.env.BOT_API_TOKEN);

async function scheduler(areaId) {
    transaction = await sequelizeInstances.sms.transaction();

    try {
        const query = `
                SELECT id, created_date
                FROM mst_prodidentity 
                WHERE cycle_type = 'end_cycle'
                ORDER BY id DESC 
                LIMIT 1
            `;

        const identity = await aio_iot[areaId - 1].query(query, {
            type: Sequelize.QueryTypes.SELECT,
        });

        if (identity.length > 0) {
            currentCycle = await db.sms.mst_cycle.findOne({
                attributes: { exclude: ['area_id'] },
                where: {
                    end_date: null,
                    area_id: areaId
                }
            });

            if (!currentCycle) {
                throw new Error('Cant find current cycle!');
            }

            if (identity[0].id <= currentCycle.prodidentity_id) {
                throw new Error('Not time to create a new cycle yet!');
            }

            console.log('insert cycle area', areaId, identity[0].id)
            await closeCurrentCycle(areaId, identity[0].id);
            const nextCycle = await getNextCycle();
            const cycleData = await insertCycle(nextCycle, areaId, identity[0].id);

            // check if its not stop cycle
            if (!cycleData.reason_stop) {
                await insertTaskCheck(cycleData)
                await sendReminder(areaId, nextCycle);
            }
        }

        await transaction.commit();

        return 'Generate Successfully';
    } catch (e) {
        await transaction.rollback();
        console.log('Error', e);
        return e.message;
    }
}


async function getNextCycle() {
    try {
        console.log('check if current cycle is this year...')
        const isCurrentYear = moment(currentCycle.start_date).isSame(new Date(), 'year');
        let nextCycle = 1;

        if (isCurrentYear) {
            nextCycle = parseInt(currentCycle.cycle.split(' ')[1]) + 1;
        }

        return nextCycle;
    } catch (e) {
        throw e;
    }
}

async function closeCurrentCycle(areaId) {
    try {
        console.log('close curr cycle', areaId);
        // update end_date
        currentCycle.end_date = moment().format("YYYY-MM-DD HH:mm:ss");

        console.log('update curr cycle end_date');
        await currentCycle.save({ transaction });
    } catch (e) {
        throw e;
    }
}

async function insertCycle(cycle, areaId, identityId = 0) {
    try {
        const date = moment().format('YYYY-MM-DD');

        const cycleStopData = await db.sms.cycle_note.findOne({
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
            ...(cycleStopData ? { reason_stop: cycleStopData.reason_stop } : {}),
            start_date: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
        }, { transaction });

        return cycleData;
    } catch (e) {
        throw e;
    }
}

async function insertTaskCheck(cycleData) {
    try {
        console.log('increment/decrement current_week...');
        await sequelizeInstances.sms.query(`
            UPDATE mst_check mc
            JOIN mst_lokasi ml ON ml.id = mc.id_location
            SET mc.current_week = CASE
                WHEN mc.current_week >= mc.total_cycle THEN 1
                ELSE mc.current_week + 1
            END
            WHERE ml.id_area = ?`, {
            replacements: [cycleData.area_id],
            transaction
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
            await db.sms.tr_check.bulkCreate(trChecks, { transaction });
        }
    } catch (e) {
        throw e;
    }
}

async function sendReminder(areaId, cycle) {
    try {
        console.log("Send reminder...")
        const areaName = ['LINE 1', 'LINE 2', 'LINE 3'];
        const groupChatId = process.env.GROUP_CHAT_ID;

        await bot.telegram.sendMessage(
            groupChatId,
            `Dear All, mohon bantuannya untuk untuk melakukan pengecekan CILT ${areaName[areaId - 1]} Cycle ${cycle}`
        );

        console.log('successfully send reminder')
    } catch (e) {
        throw e;
    }
}

exports.scheduleJobsApi = async (req, res) => {
    try {
        const line1 = await scheduler(1);
        const line2 = await scheduler(2);
        const line3 = await scheduler(3);

        response(req, res, {
            status: 200,
            data: {
                line_1: line1,
                line_2: line2,
                line_3: line3,
            },
        });
    } catch (error) {
        console.error('api', error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.scheduleJobs = async () => {
    await scheduler(1);
    await scheduler(2);
    await scheduler(3);
}
