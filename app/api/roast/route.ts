import OpenAI from "openai";
import { NextResponse } from "next/server";
import { fetchWalletData } from "@/lib/fetchWalletData";
import type { WalletData } from "@/lib/fetchWalletData";
import { getI18n, interpolate, normalizeLocale, type Locale } from "@/lib/i18n";

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_ADDRESS = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

type RoastResult = {
  roast: string;
  score: number;
  labels: string[];
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildFallbackRoast(
  walletData: WalletData,
  locale: Locale,
): RoastResult {
  const copy = getI18n(locale).api.fallback;
  const txCount = Number(walletData.transactionCount || 0);
  const tokenCount = walletData.tokens.length;
  const nftCount = walletData.nfts.length;
  const balance = Number(walletData.balance || 0);

  let score = 25;
  score += Math.min(30, txCount * 0.15);
  score += Math.min(20, tokenCount * 6);
  score += Math.min(15, nftCount * 5);
  if (balance < 0.05) score += 12;
  if (balance > 2) score -= 8;

  const finalScore = clampScore(score);
  const labels = [
    txCount > 100 ? copy.labels.hyperactive : copy.labels.casual,
    tokenCount > 3 ? copy.labels.altcoinCollector : copy.labels.concentrated,
    nftCount > 0 ? copy.labels.jpegWarrior : copy.labels.noJpegExposure,
  ];

  return {
    roast: interpolate(copy.roastTemplate, {
      address: walletData.address,
      txCount,
      tokenCount,
      nftCount,
      balance: walletData.balance,
    }),
    score: finalScore,
    labels,
  };
}

function isInvalidApiKeyError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { status?: unknown; code?: unknown };
  return maybeError.status === 401 || maybeError.code === "invalid_api_key";
}

export async function POST(req: Request) {
  let selectedLocale: Locale = "en";
  try {
    const { address, isDemo, locale } = await req.json();
    selectedLocale = normalizeLocale(locale);
    const apiCopy = getI18n(selectedLocale).api;
    const targetAddress = address || DEFAULT_ADDRESS;
    const demoMode = Boolean(isDemo);

    if (!address && !demoMode) {
      return NextResponse.json(
        { error: apiCopy.errors.noAddressProvided },
        { status: 400 },
      );
    }

    if (address && !ETH_ADDRESS_REGEX.test(address)) {
      return NextResponse.json(
        { error: apiCopy.errors.invalidEthereumAddress },
        { status: 400 },
      );
    }

    const walletData = await fetchWalletData(targetAddress, demoMode);
    const openaiKey = process.env.OPENAI_API_KEY;

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
    ${apiCopy.prompt.languageInstruction}
    Finish with a 'Degen Score' (0-100) based on how reckless their activity looks.

    Respond ONLY with a valid JSON object, no extra text:
    {
      "roast": "ROAST_TEXT_HERE",
      "score": 75,
      "labels": ["Degenerate", "Paperhands"]
    }

    The score must be a number (integer), not a string.`;

    if (!openaiKey) {
      if (process.env.NODE_ENV !== "production" || demoMode) {
        return NextResponse.json(
          buildFallbackRoast(walletData, selectedLocale),
        );
      }
      return NextResponse.json(
        { error: apiCopy.errors.missingOpenAIKey },
        { status: 503 },
      );
    }

    try {
      const openai = new OpenAI({ apiKey: openaiKey });
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
    } catch (modelError) {
      if (isInvalidApiKeyError(modelError)) {
        if (process.env.NODE_ENV !== "production" || demoMode) {
          return NextResponse.json(
            buildFallbackRoast(walletData, selectedLocale),
          );
        }
        return NextResponse.json(
          { error: apiCopy.errors.invalidOpenAIKey },
          { status: 503 },
        );
      }

      console.error("Roast model error:", modelError);
      if (process.env.NODE_ENV !== "production" || demoMode) {
        return NextResponse.json(
          buildFallbackRoast(walletData, selectedLocale),
        );
      }
      return NextResponse.json(
        { error: apiCopy.errors.modelUnavailable },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json(
      {
        error: getI18n(selectedLocale).api.errors.requestFailed,
      },
      { status: 500 },
    );
  }
}
