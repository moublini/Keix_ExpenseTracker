import { initTRPC, TRPCError } from "@trpc/server"
import type { Context } from "./context";

const t = initTRPC
    .context<Context>()
    .create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
    const { ctx } = opts;
    if (!ctx.userData)
        throw new TRPCError({
            message: "No user has been found.",
            code: "UNAUTHORIZED",
        });

    return opts.next({
        ctx,
    });
})