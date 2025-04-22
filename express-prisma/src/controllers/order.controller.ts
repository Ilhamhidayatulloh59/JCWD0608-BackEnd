import { Request, Response } from "express";
import prisma from "../prisma";
import xendit from "../helpers/xendit";
import { CreateInvoiceRequest } from "xendit-node/invoice/models";
import { StatusOrder } from "../../prisma/generated/client";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { ticketId, qty, amount } = req.body;
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            ticketId,
            qty,
            amount,
            status: "PENDING",
            expiredAt: new Date(Date.now() + 60 * 60 * 1000),
            userId: req.user?.id!,
          },
        });

        await tx.ticket.update({
          data: { quota: { decrement: qty } },
          where: { id: ticketId },
        });

        const data: CreateInvoiceRequest = {
          amount,
          invoiceDuration: "3600",
          externalId: order.id,
          description: `Invoice order with id ${order.id}`,
          currency: "IDR",
          reminderTime: 1,
        //   successRedirectUrl: ``
        };

        const invoice = await xendit.Invoice.createInvoice({ data });

        await tx.order.update({
          data: { invoiceUrl: invoice.invoiceUrl },
          where: { id: order.id },
        });

        res.status(201).send({ message: "Order created!", invoice });
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status, external_id } = req.body;
      console.log(req.body);
      if (status == StatusOrder.PAID) {
        await prisma.order.update({
          data: { status: "PAID" },
          where: { id: external_id },
        });
      } else if (status == StatusOrder.EXPIRED) {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            data: { status: "EXPIRED" },
            where: { id: external_id },
          });

          const order = await tx.order.findUnique({
            where: { id: external_id },
          });

          await tx.ticket.update({
            data: { quota: { increment: order?.qty } },
            where: { id: order?.ticketId },
          });
        });
      }

      res.status(200).send({ message: "success" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
