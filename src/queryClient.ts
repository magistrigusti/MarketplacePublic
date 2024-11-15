import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
	defaultOptions : {
		queries : {
            // nevermind ... gets annoying ...
            refetchOnWindowFocus: false, // process.env.NODE_ENV === 'production',
		}
	}
})
