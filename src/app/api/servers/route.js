// API route for server suggestions
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  // Sample server suggestions (in a real app, this would come from a database)
  const allServers = [
    { name: "SAMONLINE FTP SERVER", category: "FTP Servers", description: "Popular movie and software FTP server" },
    { name: "DISCOVERY FTP SERVER", category: "FTP Servers", description: "General content FTP server" },
    { name: "CTGMOVIES FTP SERVER", category: "Media Servers", description: "Chittagong-based movie server" },
    { name: "BOSSBD FTP SERVER", category: "Media Servers", description: "High-speed movie content server" },
    { name: "NATURALBD FTP SERVER", category: "Media Servers", description: "NaturalBD entertainment content" },
    { name: "ALPHAMEDIAZONE FTP SERVER", category: "Software & Applications", description: "Software and application repository" },
    { name: "DHAKA FIBER NET FTP SERVER", category: "ISP Specific", description: "Dhaka Fiber Network content server" }
  ];
  
  // Filter servers based on query
  const suggestions = query 
    ? allServers.filter(server => 
        server.name.toLowerCase().includes(query.toLowerCase()) ||
        server.category.toLowerCase().includes(query.toLowerCase())
      )
    : allServers.slice(0, 5); // Return top 5 if no query
  
  return new Response(JSON.stringify(suggestions), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // In a real implementation, you would:
    // 1. Validate the suggestion data
    // 2. Store it in a database
    // 3. Implement moderation workflow
    // 4. Return appropriate response
    
    // For now, we'll just log it and return success
    console.log('New server suggestion:', data);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Server suggestion submitted successfully' 
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error processing suggestion' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}