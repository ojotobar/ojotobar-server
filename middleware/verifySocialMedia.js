const verifySocialMediaName = (...allowedSocialName) => {
    return (req, res, next) => {
        const { name, url } = req.body;
        if(!name || !url) return res.status(400).json({'message':'All the fields are required.'});
        const smArray = [...allowedSocialName];
        if(!smArray.includes(name)) return res.status(400).json({'message':'Social Media name not allowed'});
        next();
    }
}

module.exports = verifySocialMediaName;