const {
    getHealthByPatientId,
    upsertHealthProfile
} = require('../queries/healthQueries');

const getPatientHealth = async (req, res) => {

    try {

        const patientId = req.params.id;

        const health = await getHealthByPatientId(patientId);

        if (!health) {
            return res.status(404).json({
                message: 'No health profile found'
            });
        }

        res.json(health);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Failed to fetch health profile'
        });

    }
};

const savePatientHealth = async (req, res) => {

    try {

        const result = await upsertHealthProfile(req.body);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Failed to save health profile'
        });

    }
};

module.exports = {
    getPatientHealth,
    savePatientHealth
};