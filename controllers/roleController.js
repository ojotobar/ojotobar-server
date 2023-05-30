const Role = require('../models/Role');

const create = async (req, res) => {
    const { name, role } = req.body;
    if(!name || !role) return res.status(400).json({ 'message': "The Name and Role fields are required."})
    const duplicate = await Role.findOne({ name: name } || { role: role}).exec();
    if(duplicate) return res.sendStatus(409);

    try {
        await Role.create({
            "name": name,
            "role": role
        });
        res.status(200).json({ 'message': `New Role ${name} successfully added.`});
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const role = await Role.findOne({ _id: id }).exec();
    if(!role) return res.status(400).json({ 'message': `Role with the Id: ${id} not found.`});

    if(req.body?.name) role.name = req.body.name;
    if(req.body?.role) role.role = req.body.role;
    const result = await role.save();

    res.status(200).json(result);
}

const getById = async (req, res) => {
    const id = req.params.id;
    const roleFromDB = await Role.findOne({ _id: id }).exec();
    if(!roleFromDB) return res.status(400).json({ 'message': `Role with the Id: ${id} not found.`});

    res.status(200).json(roleFromDB);
}

const getAll = async (req, res) => {
    const roles = await Role.find();
    res.status(200).json(roles);
}

const remove = async (req, res) => {
    const id = req.params.id;
    const roleFromDB = await Role.findOne({ _id: id }).exec();
    if(!roleFromDB) return res.status(400).json({ 'message': `Role with the Id: ${id} not found.`});

    const result = await roleFromDB.deleteOne({ _id: id });
    res.sendStatus(204);
}

module.exports = { 
    create,
    update,
    getById,
    getAll,
    remove
};