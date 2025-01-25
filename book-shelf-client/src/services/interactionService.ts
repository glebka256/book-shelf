import baseInstance from "@/api/baseInstance";
import { getResponseError } from "@/api/main";
import { useInteractionStore } from "@/store/interactionStore";
import { UserInteraction } from "@/types/User";

const postInteractions = async (interactions: UserInteraction[]) => {
    try {
        const response = await baseInstance.post(
            '/users/interactions/',
            { interactions: interactions }
        );

        if (response.status === 200) {
            console.log("Interactions sent successfully.");

            const interactionStore = useInteractionStore();
            interactionStore.clearInteractions();
        } else {
            console.log("Failed to send interactions.");
        }
    } catch (error) {
        console.error("Error sending interactions: ", getResponseError(error));
    }
}

export const sendInteractions = async () => {
    const interactionStore = useInteractionStore();

    if (interactionStore.interactionCount > 0) {
        await postInteractions(interactionStore.interactions);
    }
}
