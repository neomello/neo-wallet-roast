import OpenAI from "openai";
import { NextResponse } from "next/server";
import { fetchWalletData } from "@/lib/fetchWalletData";

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export async function POST(req: Request) {
  try {
    const { address, isDemo } = await req.json();

    if (!address && !isDemo) {
      return NextResponse.json({ error: "No address provided" }, { status: 400 });
    }

    if (address && !ETH_ADDRESS_REGEX.test(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const walletData = await fetchWalletData(address, isDemo);

    const prompt = `You are an expert roast master. You specialize in roasting crypto wallets on behalf of 'NEO Wallet Roast'.
    The wallet data is below:
    Address: ${walletData.address}
    Balance (ETH): ${walletData.balance}
    Transaction Count: ${walletData.transactionCount}
    Token List: ${JSON.stringify(walletData.tokens)}
    NFT List: ${JSON.stringify(walletData.nfts)}
    Network: ${walletData.network}

    Your goal is to be brutally funny, sarcastic, and sharp.
    Use the coins they hold or the lack of them to mock their financial decisions.
    Keep it within 100-200 words. Make it punchy.
    Use a tone like a cynical degen who has seen everything.
    Finish with a 'Degen Score' (0-100) based on how reckless their activity looks.

    Respond ONLY with a valid JSON object, no extra text:
    {
      "roast": "ROAST_TEXT_HERE",
      "score": 75,
      "labels": ["Degenerate", "Paperhands"]
    }

    The score must be a number (integer), not a string.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const textRes = completion.choices[0].message.content ?? "{}";

    try {
      const parsed = JSON.parse(textRes);
      parsed.score = Number(parsed.score) || 0;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ roast: textRes, score: 0, labels: [] });
    }

  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json({
      error: "Claude got stunned by how pathetic this wallet is. Try again later.",
    }, { status: 500 });
  }
}
