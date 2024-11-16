import { accounts, Qr as QRDto } from "@car-qr-link/apis";
import { Account } from "src/core/accounts/accounts.entity";
import { QR } from "src/core/qrs/qrs.entity";

export function qrToDto(model: QR): QRDto {
    return {
        id: model.code,
        licensePlate: model.licensePlate,
        accountId: model.accountId?.toString(),
    };
}

export function accountToDto(model: Account | null): accounts.Account | null {
    if (!model) {
        return null;
    }

    return {
        id: model.id.toString(),
        name: model.name,
        contacts: model.contacts.map(contact => ({ channel: contact.channel, address: contact.value })),
    };
}