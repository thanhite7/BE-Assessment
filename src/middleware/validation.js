import Joi from 'joi';
export const validateRegisterRequest = (req, res, next) => {
  const schema = Joi.object({
    teacher: Joi.string().email().required().messages({
      'string.email': 'Teacher must be a valid email address',
      'any.required': 'Teacher email is required'
    }),
    students: Joi.array()
      .items(Joi.string().email().messages({
        'string.email': 'All student entries must be valid email addresses'
      }))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one student email is required',
        'any.required': 'Students array is required'
      })
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  next();
};
export const validateCommonStudentsQuery = (req, res, next) => {
  const teachers = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher];
  if (!teachers || teachers.length === 0 || teachers.some(t => !t)) {
    return res.status(400).json({
      message: 'At least one teacher parameter is required'
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const teacher of teachers) {
    if (typeof teacher !== 'string' || !emailRegex.test(teacher)) {
      return res.status(400).json({
        message: 'All teacher parameters must be valid email addresses'
      });
    }
  }
  req.query.teacher = teachers;
  next();
};
export const validateSuspendRequest = (req, res, next) => {
  const schema = Joi.object({
    student: Joi.string().email().required().messages({
      'string.email': 'Student must be a valid email address',
      'any.required': 'Student email is required'
    })
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  next();
};
export const validateNotificationRequest = (req, res, next) => {
  const schema = Joi.object({
    teacher: Joi.string().email().required().messages({
      'string.email': 'Teacher must be a valid email address',
      'any.required': 'Teacher email is required'
    }),
    notification: Joi.string().required().messages({
      'any.required': 'Notification text is required'
    })
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  next();
};
