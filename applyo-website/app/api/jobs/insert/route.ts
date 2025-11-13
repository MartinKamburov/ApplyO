import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseConnection } from "@/lib/database/supabase";

export async function POST(req: Request){
    const session = await auth();

    console.log("Here is the session info: ")
    console.log(session);

    if (!session?.user?.email){
        return NextResponse.json({ status: 403 });
    }

    try {
        const body = await req.json();

        const dataInput = { 
            ...body,
            email: session.user.email 
        }

        console.log(dataInput);

        const { data, error } = await supabaseConnection
            .from("user_job_data")
            .insert(dataInput)
            .select()


        if (error) throw error;

        console.log("in the api route");
        console.log(data);

        // return NextResponse.json(inserted, { status: 201 });
        return NextResponse.json({ status: 201 });
    } catch (err: any) {
        console.error("API /api/jobs/insert error:", err);
        return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
    }

}
