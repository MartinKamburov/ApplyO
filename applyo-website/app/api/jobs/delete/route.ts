import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseConnection } from "@/lib/database/supabase";

export async function DELETE(req: Request){
    const session = await auth();

    if (!session?.user?.email){
        return NextResponse.json({ status: 403 });
    }

    try {
        const body = await req.json();

        const dataInput = { 
            ...body,
            email: session.user.email 
        }
        

        const { data, error } = await supabaseConnection
            .from("user_job_data")
            .insert(dataInput)
            .select()


        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        console.error("API /api/jobs/insert error:", err);
        return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
    }

}
