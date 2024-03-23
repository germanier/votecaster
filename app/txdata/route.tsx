import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
    Abi,
    createPublicClient,
    getContract,
    http,
} from "viem";
import { mainnet } from "viem/chains";
import { ozGovernorABI } from "./contracts/oz-governor";

const ozGovernorAddress = "0xEC568fffba86c094cf06b22134B23074DFE2252c"; // AAVE OZ Governor
const msgSender = "0x57ab7ee15cE5ECacB1aB84EE42D5A9d0d8112922"; // AAVE Delegatee with some votes
const chain = mainnet;

export async function POST(
    req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
    const json = await req.json();

    const frameMessage = await getFrameMessage(json);

    if (!frameMessage) {
        throw new Error("No frame message");
    }

    const publicClient = createPublicClient({
        chain: chain,
        transport: http(),
    });

    const block = await publicClient.getBlock();

    const ozGovernor = getContract({
        address: ozGovernorAddress,
        abi: ozGovernorABI,
        client: publicClient,
    });

    const userVotes = await ozGovernor.read.getVotes([msgSender, block.number]);

    console.log(userVotes);

    return NextResponse.json({
        chainId: "eip155:1", // Mainnet
        method: "eth_sendTransaction",
        params: {
            abi: storageRegistryABI as Abi,
            to: STORAGE_REGISTRY_ADDRESS,
            data: calldata,
            value: unitPrice.toString(),
        },
    });
}
