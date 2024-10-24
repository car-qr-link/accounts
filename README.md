# Сервис учетных записей

Отвечает за хранение учетных записей пользователей и QR-кодов. Имя пакета `@car-qr-link/accounts`.

## Используемые технологии, библиотеки

- [NestJS](https://nestjs.com)
- [TypeORM](https://github.com/typeorm/typeorm)
- [Nanoid](https://github.com/ai/nanoid) - для генерации ИД QR-кодов
- [MariaDB](https://mariadb.org/)

## Настройки

Для настройки сервиса используются переменные окружения:

| Название переменной окружения | Описание                          |
| ----------------------------- | --------------------------------- |
| DATABASE_URL                  | Строка подключения к базе данных. |
| NODE_ENV                      | Режим разработки.                 |

## Сущности

- Учетная запись/аккаунт: **ИД**, имя, контакты (**номер телефона**, электронная почта, ...)
- QR-код: **ИД**, гос. номер авто, ИД аккаунта

Обращаю внимание, что описанные тут сущности не обязаны в точности соответствовать структуре БД. Структура БД на усмотрение разработчика. **Жирным** выделены обязательные поля.

## Входящие взаимодействия

Сервис должен предоставлять REST API с общим префиксом `/api/v1`:

| Метод                               | Запрос                                                                         | Ответ                                                                                                                                      | Описание                               |
| ----------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| GET /accounts                       | -                                                                              | `200` - `GetAccountsResponse`                                                                                                              | Возвращает список аккаунтов            |
| **GET /accounts/:id?field={field}** | `:id` - значение поля <br/> `field` - поле для поиска: **`id`**, `phone`       | `200` - `GetAccountResponse` <br/> `404` - аккаунт не найден                                                                               | Возвращает аккаунт под одному из полей |
| PATCH /accounts/:id                 | `:id` - ИД аккаунта <br/> тело - `EditAccountRequest`                          | `200` - `EditAccountResponse` <br/> `400` - некорректные данные <br/> `404` - аккаунт не найден <br/> `409` - конфликт по уникальным полям | Редактирует аккаунт по ИД              |
| GET /qrs?accountId={accountId}      | `accountId` - фильтр по ИД аккаунта (отсутствует - все, пустой - без аккаунта) | `200` - `GetQrsResponse`                                                                                                                   | Возвращает список QR-кодов             |
| **GET /qrs/:id**                    | `:id` - идентификатор QR-кода                                                  | `200` - `GetQrResponse` <br/> `404` - QR не найден                                                                                         | Возвращает QR-код по идентификатору    |
| POST /qrs/emit                      | тело - `EmitQrsRequest`                                                        | `200` - `EmitQrsResponse` <br> `400` - некорректные данные                                                                                 | Генерирует новые QR-коды               |
| **PATCH /qrs/:id**                  | `:id` - идентификатор QR-кода <br/> тело - `LinkQRRequest`                     | `200` - `LinkQrResponse` <br/> `400` - некорректные данные <br/>  `404` - QR не найден <br/> `409` - QR уже связан с аккаунтом             | Привязывает QR-код к аккаунту          |

Названия типов из пакета `@car-qr-link/apis`. **Жирным** отмечены обязательные методы, остальные методы второстепенные для административных целей.

Все ошибки должны возвращаться в виде интерфейса `ErrorResponse`. Непредвиденные ошибки (код 5xx) должны журналироваться в консоль.

## Исходящие взаимодействия

Отсутствуют.

## Дополнительные требования

1. Создание и обновление структуры БД выполняется через миграции из состава TypeORM.
2. Сервис должен быть упакован в Docker.
3. Должен быть `docker-compose.yml` со всеми зависимостями для разработки и тестирования.
4. В идеале - GitHub Actions с тестированием, линтингом и сборкой Docker-контейнера. В качестве реестра контейнеров предлагаю использовать сам GitHub: https://docs.github.com/en/actions/use-cases-and-examples/publishing-packages/publishing-docker-images#publishing-images-to-github-packages
