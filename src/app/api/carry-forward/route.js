import KKCASMonth from '@/models/kkcas';
import CIETMonth from '@/models/ciet';
import CIETMbaMonth from '@/models/ciet-mba';
import CIETSoaMonth from '@/models/ciet-soa';
import { connectDB } from '@/models/mongodb';
import { NextResponse } from 'next/server';

//Carry Forwarding the Pending Reels and Posters
export async function POST() {
  try {
    await connectDB();

    // 🔥 All college models
    const models = [
      {
        Model: KKCASMonth,
        name: 'Kovai Kalaimagal College of Arts and Science',
      },
      {
        Model: CIETMonth,
        name: 'Coimbatore Institute of Engineering and Technology',
      },
      { Model: CIETMbaMonth, name: 'CIET MBA (AUTONOMOUS)' },
      { Model: CIETSoaMonth, name: 'School of Architecture - CIET' },
    ];

    // ⭐ Current month
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    // ⭐ Previous month
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);

    const prevMonth = prevDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const results = [];

    // 🔥 LOOP ALL COLLEGES
    for (const item of models) {
      const Model = item.Model;
      const collegeName = item.name;

      const prevDoc = await Model.findOne({
        name: collegeName,
        month: prevMonth,
      });

      const currentDoc = await Model.findOne({
        name: collegeName,
        month: currentMonth,
      });

      if (!currentDoc) continue;

      let carryReels = 0;
      let carryPosters = 0;

      if (prevDoc) {
        carryReels = (6 - prevDoc.reels) + prevDoc.pending_reels;
        carryPosters = (15 - prevDoc.posters) + prevDoc.pending_posters;
      }

      currentDoc.pending_reels += carryReels;
      currentDoc.pending_posters += carryPosters;

      await currentDoc.save();

      results.push({
        college: collegeName,
        pending_reels: currentDoc.pending_reels,
        pending_posters: currentDoc.pending_posters,
      });
    }

    return NextResponse.json({
      message: 'Carry forward applied to all colleges',
      data: results,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
