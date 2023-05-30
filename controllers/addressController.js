const Address = require('../models/Address');
const User = require('../models/User');

const create = async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    const {
        line1,
        line2,
        city,
        postalCode,
        state,
        country
    } = req.body;

    if(!line1 || !postalCode || !state || !city || !country)
        return res.status(400).json({'message':'Please fill in all the required fields'});

    try {
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!user) return res.status(404).json({'message':'User not found.'});

        const address = {
            "userId": user._id,
            "line1": line1,
            "line2": line2,
            "city": city,
            "state": state,
            "country": country,
            "postalCode": postalCode,
        }
        await Address.create(address);
        res.status(200).json({'message':'Address record successfully added.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const get = async (req, res) => {
    try {
        const address = await Address.find();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getByRouteUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const address = await Address.findOne({ userId: userId }).exec();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const address = await Address.findOne({ _id: id }).exec();
        if(!address) return res.status(404).json({'message':`No address record found for the Id: ${id}`});
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const update = async (req, res) => {
    var id = req.params.id;
    const {
        line1,
        line2,
        city,
        postalCode,
        state,
        country
    } = req.body;

    if(!line1 || !postalCode || !state || !city || !country)
        return res.status(400).json({'message':'Please fill in all the required fields'});
    try {
        const add = await Address.findOne({ _id: id }).exec();
        if(!add) return res.status(404).json({'message':`No address record found for Id: ${id}`});

        add.line1 = line1;
        add.line2 = line2;
        add.city = city;
        add.postalCode = postalCode;
        add.country = country;
        add.state = state;

        await add.save();
        res.status(200).json({'message':'Address record successfully updated.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        await Address.findByIdAndDelete({ _id: id });
        res.status(200).json({'message':'Address record successfully deleted.'});
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
};

module.exports = {
    create,
    get,
    getById,
    getByRouteUserId,
    update,
    remove
}