import KKCASMonth from '@/models/kkcas';
import CIETMonth from '@/models/ciet';
import CIETMbaMonth from '@/models/ciet-mba';
import CIETSoaMonth from '@/models/ciet-soa';
import { connectDB } from '@/models/mongodb';
import { NextResponse } from 'next/server';

//Get the Data of All Colleges
export async function GET() {
  try {
    await connectDB();

    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    // 🔥 Fetch all colleges for current month
    const kkcas = await KKCASMonth.find({ month: currentMonth });
    const ciet = await CIETMonth.find({ month: currentMonth });
    const mba = await CIETMbaMonth.find({ month: currentMonth });
    const soa = await CIETSoaMonth.find({ month: currentMonth });

    // ⭐ Combine into one array
    const allColleges = [...kkcas, ...ciet, ...mba, ...soa];

    return NextResponse.json({
      month: currentMonth,
      data: allColleges,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
