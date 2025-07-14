// app/api/users/route.js
import dbConnect from '@/lib/dbconnect';
import user from '@/models/user';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  if (searchParams.has('email')) {
    const email = searchParams.get('email');

    const users = await user.find({ email: email });
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  };

  if (searchParams.has('uuid')) {
    const uuid = searchParams.get('uuid');
    const users = await user.find({ id: uuid })
    let obj = users[0]
    let res = {title: obj.title, note: obj.note}
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request) {
  await dbConnect();

  const body = await request.json();
  const { title, note, email, id } = body
  const newUser = await user.create({ title, note, email, id });

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}


export async function DELETE(request) {
  await dbConnect();

  const body = await request.json();
  const { id } = body
  await user.deleteOne({ id: `${id}` })

  return new Response(JSON.stringify({ success: "Note Deleted Successfully" }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}


export async function PATCH(req) {
  await dbConnect();

  const { id, title, note } = await req.json();

  await user.findByIdAndUpdate(id, { title, note });
}