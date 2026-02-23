import KKCASMonth from '@/models/kkcas';
import CIETMonth from '@/models/ciet';
import CIETMbaMonth from '@/models/ciet-mba';
import CIETSoaMonth from '@/models/ciet-soa';
import { connectDB } from '@/models/mongodb';
import { NextResponse } from 'next/server';

/* ===== CREATE MONTH FIRST ===== */
export async function POST() {
  try {
    await connectDB();

    // const prevDate = new Date();
    // prevDate.setMonth(prevDate.getMonth() - 1);

    // const currentMonth = prevDate.toLocaleString("default", {
    //   month: "long",
    //   year: "numeric",
    // });

    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

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

    const results = [];

    for (const { Model, name } of models) {
      const exists = await Model.findOne({
        name,
        month: currentMonth,
      });

      if (!exists) {
        const doc = new Model({
          name,
          month: currentMonth,
        });

        await doc.save();
        results.push(doc);
      }
    }

    if (results.length > 0) {
      return NextResponse.json({
        message: 'Month created for all colleges',
        data: results,
        month: currentMonth,
      },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
    } else {
      return NextResponse.json(
        { message: 'Current Month already Exists!' },
        { status: 409 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    }
      );
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }
}

