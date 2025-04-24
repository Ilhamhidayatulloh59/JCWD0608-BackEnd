"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const xendit_1 = __importDefault(require("../helpers/xendit"));
const client_1 = require("../../prisma/generated/client");
class OrderController {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticketId, qty, amount } = req.body;
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const order = yield tx.order.create({
                        data: {
                            ticketId,
                            qty,
                            amount,
                            status: "PENDING",
                            expiredAt: new Date(Date.now() + 60 * 60 * 1000),
                            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        },
                    });
                    yield tx.ticket.update({
                        data: { quota: { decrement: qty } },
                        where: { id: ticketId },
                    });
                    const data = {
                        amount,
                        invoiceDuration: "3600",
                        externalId: order.id,
                        description: `Invoice order with id ${order.id}`,
                        currency: "IDR",
                        reminderTime: 1,
                        //   successRedirectUrl: ``
                    };
                    const invoice = yield xendit_1.default.Invoice.createInvoice({ data });
                    yield tx.order.update({
                        data: { invoiceUrl: invoice.invoiceUrl },
                        where: { id: order.id },
                    });
                    res.status(201).send({ message: "Order created!", invoice });
                }));
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, external_id } = req.body;
                console.log(req.body);
                if (status == client_1.StatusOrder.PAID) {
                    yield prisma_1.default.order.update({
                        data: { status: "PAID" },
                        where: { id: external_id },
                    });
                }
                else if (status == client_1.StatusOrder.EXPIRED) {
                    yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        yield tx.order.update({
                            data: { status: "EXPIRED" },
                            where: { id: external_id },
                        });
                        const order = yield tx.order.findUnique({
                            where: { id: external_id },
                        });
                        yield tx.ticket.update({
                            data: { quota: { increment: order === null || order === void 0 ? void 0 : order.qty } },
                            where: { id: order === null || order === void 0 ? void 0 : order.ticketId },
                        });
                    }));
                }
                res.status(200).send({ message: "success" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.OrderController = OrderController;
