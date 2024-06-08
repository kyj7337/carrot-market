'use server';
import crypto from 'crypto';
import twilio from 'twilio';
import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { sessionLogin } from '@/lib/session';
const formSchema = z.object({
  phone: z.string(),
  token: z.string(),
});

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), '잘못된 번호 양식 입니다.');

const minTokenValue = 100000;
const maxTokenValue = 999999;

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: String(token),
    },
    select: {
      userId: true,
      id: true,
    },
  });
  return !!exists;
}

/** coerce 를 사용하면 string 을 뒤에 선언된 number 로 변환할것임 */
//* 뜻: coercion (강제)
const tokenSchema = z.coerce
  .number()
  .min(minTokenValue, `${minTokenValue}부터 입려해 주세요.`)
  .max(maxTokenValue, '최대 범위를 넘었습니다.')
  .refine(tokenExists, '토큰이 존재하지 않습니다.'); // * 토큰이 존재하는지 확인하고 넘겨준다.;

interface smsActionPrevState {
  token: boolean;
  error?: any;
}

const setTokenValue = (tokenExist: boolean) => ({ token: tokenExist });

async function getToken() {
  const token = crypto.randomInt(minTokenValue, maxTokenValue).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token,
    },
    select: {
      id: true,
    },
  });
  if (exists) return getToken(); // * 재귀
  else return token;
}

export const smsAction = async (prevState: smsActionPrevState, data: FormData) => {
  // phone: data.get('phone'),
  // token: data.get('token'),
  const phone = data.get('phone');
  const token = data.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    console.log(result);
    if (!result.success) {
      console.log(result.error.flatten());
      return { token: false, error: result.error.flatten() };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      }); // * 이전 토큰 (이전 요청) 삭제하기
      const token = await getToken();
      // * 새 토큰 생성하기
      /** sMsToken 에 생성하거나 연결한다. user 테이블에 phone이 result.data 와 일치하면 연결하고
       * 없으면 phone과, username(랜덤한 이름)을 갖고 있는 user를 만든다.
       */
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                phone: result.data,
                username: crypto.randomBytes(10).toString('hex'), // * SMS 로그인을 하는 경우 유저 이름을 받지 못하기 때문에 랜덤 이름이 필요함.
              },
            },
          },
        },
      });
      const client = twilio(process.env.TWILI_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `당근 인증 코드는 [${token}] 입니다`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE!, // TODO: result.data 가 되어야함 (원래는)
      });
      // * token을 SMS에 보내기

      return {
        token: true,
      };
    }
  } else {
    console.log('second call');
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const smsUserData = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (smsUserData?.userId) {
        sessionLogin(smsUserData.userId);
        await db.sMSToken.delete({
          where: {
            id: smsUserData.id,
          },
        });
      }

      redirect('/profiles');
    }
  }
};
