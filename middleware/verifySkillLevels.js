const verifySkillLevels = (...allowedSkillLevel) => {
    return (req, res, next) => {
        const { level } = req.body;
        if(!level) return res.status(400).json({'message':'Skill level is a required field.'});
        const skillLevelArr = [...allowedSkillLevel];
        if(!skillLevelArr.includes(level)) return res.status(400).json({'message':'Skill level value not allowed'});
        next();
    }
}

module.exports = verifySkillLevels;