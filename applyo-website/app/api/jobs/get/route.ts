import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseConnection } from "@/lib/database/supabase";

export async function GET(){
    const session = await auth();
    
    if (!session?.user?.email){
        return NextResponse.json({ status: 403 });
    }

    try {     
        const { data, error } = await supabaseConnection
            .from("user_job_data")
            .select()
            .eq("email", session.user.email)

        if (error) throw error;

        return NextResponse.json({ data }, { status: 200 });
    } catch (err: any) {
        console.error("API /api/jobs/get error:", err);
        return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
    }

}
