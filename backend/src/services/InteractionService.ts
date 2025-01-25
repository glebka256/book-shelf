import { UserInteraction, InteractionTypes } from "@app/interfaces/User"
import { ValidationResponse } from "@app/interfaces/Util"
import { getUserInteractions, updateUserInteractions } from "@app/models/user"
import { isISO8601 } from "@app/utils"

export class InteractionService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    validate(interactions: UserInteraction[]): ValidationResponse {
        if (!Array.isArray(interactions)) {
            return {
                status: false,
                message: "Invalid data: Invalid interactions data array."
            }
        }
    
        for (const interaction of interactions) {
            if (!Object.values(InteractionTypes).includes(interaction.type)) {
                return {
                    status: false,
                    message: "Invalid data: Invalid interaction type value."
                }
            }
    
            if (!interaction.bookId) {
                return {
                    status: false,
                    message: "Missing data: Invalid bookId value."
                }
            }

            if (!interaction.timestamp || !isISO8601(interaction.timestamp.toString())) {
                return {
                    status: false,
                    message: "Invalid data: Invalid interaction timestamp value. Should be ISO8601 String."
                }
            }
        }
    
        return {
            status: true,
            message: "Interaction validated successfully"
        }
    }

    async save(interactions: UserInteraction[]): Promise<void> {
        try {
            const user = await getUserInteractions(this.userId);
            const presentInteractions = this.mapInteraction(user.interactions);

            await updateUserInteractions(this.userId, [...presentInteractions, ...interactions]);
        } catch (error) {
            throw new Error(`Could not save user interactions. User ID: ${this.userId} Last Book ID: ${interactions.at(-1).bookId}`);
        }
    }

    mapInteraction(data: any[]): UserInteraction[] {
        return data.map((interaction) => ({
            type: interaction.type,
            bookId: interaction.bookId.toString(),
            timestamp: new Date(interaction.timestamp)            
        }));
    }
}
