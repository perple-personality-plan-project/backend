import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  buildMessage,
} from 'class-validator';

const mbtiList = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ,',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

export function IsMbti(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsMbti',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [mbtiField] = args.constraints;
          const mbti = (args.object as any)[mbtiField];
          return mbtiList.includes(mbti.toUpperCase());
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `유효한 mbti가 아닙니다`,
          validationOptions,
        ),
      },
    });
  };
}
