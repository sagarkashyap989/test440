// src\app\api\learned_topics\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: {
    id: string;
  };
};


export async function GET(req: NextRequest, context: Params) {
  try {

    // return NextResponse.json([
    //   {
    //     "topic_id": 44,
    //     "chapter_id": 11,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 50,
    //     "chapter_id": 12,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 82,
    //     "chapter_id": 14,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 83,
    //     "chapter_id": 14,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 84,
    //     "chapter_id": 14,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 85,
    //     "chapter_id": 14,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 86,
    //     "chapter_id": 14,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 89,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 90,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 91,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 92,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 93,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 87,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 88,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 94,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 95,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 96,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 97,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 98,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 99,
    //     "chapter_id": 15,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 49,
    //     "chapter_id": 11,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 48,
    //     "chapter_id": 11,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 47,
    //     "chapter_id": 11,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 46,
    //     "chapter_id": 11,
    //     "course_id": null
    //   },
    //   {
    //     "topic_id": 45,
    //     "chapter_id": 11,
    //     "course_id": null
    //   }
    // ]);
    const user_id = parseInt(context.params.id);
    // let userID = Number(auth0_id.split('|')[1]); 

    const backendRes = await fetch(`${process.env.API_URL}users/learned_topics/${user_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      console.error('Backend error:', text);
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }
    const learnedTopics = await backendRes.json();
    return NextResponse.json(learnedTopics);

    // return NextResponse.json({ user: backendRes, success: true }); //how can i get user in my component?
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}



export async function POST(req: NextRequest, context: Params) {
  try {
    const explanation_id = parseInt(context.params.id);
    const body = await req.json();
    const { user_id, chapter_id, course_id } = body;
    console.log("body in learned-topics", body, explanation_id, user_id, course_id);

    if (!user_id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}users/learned_topics/${explanation_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user_id,
        chapter_id: chapter_id,
        course_id: course_id
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text() || 'Failed to update learning status');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error('Error in learned-topics API:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}


// // i get this error wheni build this:
// .next/types/app/api/learned_topics/[id]/route.ts:49:7
// Type error: Type '{ __tag__: "GET"; __param_position__: "second"; __param_type__: Params; }' does not satisfy the constraint 'ParamCheck<RouteContext>'.
//   The types of '__param_type__.params' are incompatible between these types.
//     Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

//   47 |     Diff<
//   48 |       ParamCheck<RouteContext>,
// > 49 |       {
//      |       ^
//   50 |         __tag__: 'GET'
//   51 |         __param_position__: 'second'
//   52 |         __param_type__: SecondArg<MaybeField<TEntry, 'GET'>>

// Failed to compile.