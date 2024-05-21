export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

export const ERROR_MESSAGE = {
  USERNAME_SHORT: `이름이 너무 짧습니다`,
  USERNAME_LONG: `이름이 너무 깁니다`,
  PASSWORD_TOO_SHORT: `패스워드가 너무 짧습니다`,
  EMAIL_REG: '소문자,대문자,특수문자를 포함해야 합니다.',
  EMAIL_FORM: `이메일 형식이어야 합니다.`,
  PASSWORD_NOT_MATCHED: `패스워드가 일치하지 않습니다.`,
};
