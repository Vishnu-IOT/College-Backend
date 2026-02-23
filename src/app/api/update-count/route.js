import KKCASMonth from '@/models/kkcas';
import CIETMonth from '@/models/ciet';
import CIETMbaMonth from '@/models/ciet-mba';
import CIETSoaMonth from '@/models/ciet-soa';
import { connectDB } from '@/models/mongodb';
import { NextResponse } from 'next/server';

// Update Reels and Posters Count (including Pending)
export async function POST(req) {
  try {
    await connectDB();

    const { college, reels, posters } = await req.json();

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

    const collegeObj = models.find((item) => item.name === college);

    if (!collegeObj) {
      return NextResponse.json(
        { message: 'Invalid college name' },
        { status: 400 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    }
      );
    }

    const Model = collegeObj.Model;

    const doc = await Model.findOne({
      name: college,
      month: currentMonth,
    });

    if (!doc) {
      return NextResponse.json(
        { message: 'Create month first' },
        { status: 400 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    }
      );
    }

    // 🏆 REELS UPLOAD LOGIC
    if (reels === 1) {
      if (doc.pending_reels > 0) {
        // ⭐ Reduce pending first
        doc.pending_reels -= 1;
      } else {
        // ⭐ Then increment actual reels
        if (doc.reels >= 6) {
          return NextResponse.json(
            { message: 'Reels limit exceeded' },
            { status: 400 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    }
          );
        }
        doc.reels += 1;
      }
    }
    else if (reels === -1) {
  // 🔽 DECREMENT (REMOVE UPLOAD)

  if (doc.reels > 0) {
    // ⭐ Reduce actual reels first
    doc.reels -= 1;

  } else {
    // ⭐ If reels already 0 → increase pending
    doc.pending_reels += 1;
  }
}

    // 🏆 POSTERS UPLOAD LOGIC
    if (posters === 1) {
      if (doc.pending_posters > 0) {
        // ⭐ Reduce pending first
        doc.pending_posters -= 1;
      } else {
        // ⭐ Then increment actual posters
        if (doc.posters >= 15) {
          return NextResponse.json(
            { message: 'Posters limit exceeded' },
            { status: 400 },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    }
          );
        }
        doc.posters += 1;
      }
    }
    else if (posters === -1) {
  // 🔽 DECREMENT (REMOVE UPLOAD)

  if (doc.posters > 0) {
    // ⭐ Reduce actual posters first
    doc.posters -= 1;

  } else {
    // ⭐ If posters already 0 → increase pending
    doc.pending_posters += 1;
  }
}

    await doc.save();

    return NextResponse.json({
      message: 'Upload updated successfully',
      data: doc,
    },
      {headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
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

// ⭐ Handle preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
  });
}



