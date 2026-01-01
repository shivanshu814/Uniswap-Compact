import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ENV } from "./utils/env";

export const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(ENV.RPC_URL),
    },
});
