import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp: string;
}

interface JobData {
  phone: string;
  waste_type: string;
  address: string;
  latitude: number;
  longitude: number;
  notes: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const body = await req.json();

      const message: WhatsAppMessage = {
        from: body.from || "",
        text: body.text || "",
        timestamp: new Date().toISOString(),
      };

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase configuration");
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: "GET",
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      const user = users.find((u: { phone: string }) => u.phone === message.from);

      if (!user) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not registered",
          }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const parseJobData = (text: string): Partial<JobData> => {
        const data: Partial<JobData> = {
          phone: message.from,
          waste_type: "mixed",
          address: text,
        };

        if (text.includes("recyclable")) {
          data.waste_type = "recyclable";
        } else if (text.includes("organic")) {
          data.waste_type = "organic";
        }

        data.latitude = 0;
        data.longitude = 0;

        return data;
      };

      const jobData = parseJobData(message.text);

      const jobResponse = await fetch(`${supabaseUrl}/rest/v1/jobs`, {
        method: "POST",
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          requester_id: user.id,
          waste_type: jobData.waste_type,
          address: jobData.address,
          latitude: jobData.latitude,
          longitude: jobData.longitude,
          status: "pending",
          notes: `Requested via WhatsApp on ${new Date().toISOString()}`,
        }),
      });

      if (!jobResponse.ok) {
        throw new Error("Failed to create job");
      }

      const job = await jobResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Pickup request created",
          job: job[0],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "WhatsApp webhook endpoint" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
