import baseInstance from "@/api/baseInstance";
import { useInteractionStore } from "@/store/interactionStore";

export const sendInteractions = async () => {
    const interactionStore = useInteractionStore();
    const body = JSON.stringify({ interactions: interactionStore.interactions });

    try {
        const response = await baseInstance.post('/interactions', body);

        if (response.status === 200) {
            console.log("Interactions sent successfully.");
            interactionStore.clearInteractions();
        } else {
            console.log("Failed to send interactions.");
        }
    } catch (error) {
        console.error("Error sending interactions.");
    }
}
