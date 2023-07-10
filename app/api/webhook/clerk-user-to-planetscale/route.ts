export default async  function POST(req: Request) {    
    return new Response(JSON.stringify({ message: "success" }), {
        headers: { "Content-Type": "application/json" },
    })
 
}