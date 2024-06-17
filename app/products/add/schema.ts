import { z } from 'zod';

export const productSchema = z.object({
  photo: z.string({
    required_error: '사진은 필수입니다.',
  }),
  title: z
    .string({
      required_error: '제목은 필수입니다.',
    })
    .min(4)
    .max(50),
  description: z.string({
    required_error: '설명은 필수입니다.',
  }),
  price: z.coerce
    .number({
      required_error: '가격은 필수입니다.',
    })
    .min(0), // * coerce를 하면 price 도 string 으로 들어오지만 number로 변환할것임.
});

export type ProductType = z.infer<typeof productSchema>;
