import { UserInteraction, ClientInteraction, interactionTypes, StorageInteraction } from "@app/interfaces/User"
import { ValidationResponse } from "@app/interfaces/Util"
import { getUserInteractions, updateUserInteractions } from "@app/models/user"
import { isISO8601 } from "@app/utils"
import { Logger } from "@app/utils/Logger";

export class InteractionService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    parseInteractionArray(interactions: ClientInteraction[]): UserInteraction[] {
        return interactions.map((interaction) => {
            try {
                return this.parseInteraction(interaction);
            } catch (error) {
                throw error;
            }
        }).filter((interaction): interaction is UserInteraction => interaction !== null);
    }

    parseInteraction(interaction: ClientInteraction): UserInteraction {
        const interactionType = Object.values(interactionTypes).find(
            (entry) => entry.tag === interaction.type
        );

        if (!interactionType) {
            throw new Error(`Unknown interaction tag: ${interaction.type}`);
        }

        return {
            type: interactionType,
            bookId: interaction.bookId,
            timestamp: new Date(interaction.timestamp)
        }
    }

    validate(interactions: UserInteraction[]): ValidationResponse {
        if (!Array.isArray(interactions)) {
            return {
                status: false,
                message: "Invalid data: Invalid interactions data array."
            }
        }
    
        for (const interaction of interactions) {
            if (!Object.values(interactionTypes).includes(interaction.type)) {
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

            if (!interaction.timestamp || !isISO8601(interaction.timestamp)) {
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
            const presentInteractions = this.mapToStorage(this.mapFromStorage(user.interactions));  // lol
            const newInteractions = this.mapToStorage(interactions);

            await updateUserInteractions(this.userId, [...presentInteractions, ...newInteractions]);
        } catch (error) {
            throw new Error(`Could not save user interactions. User ID: ${this.userId} Last Book ID: ${interactions.at(-1).bookId}`);
        }
    }

    async load(): Promise<UserInteraction[]> {
        try {
            const user = await getUserInteractions(this.userId);
            return this.mapFromStorage(user.interactions);
        } catch (error) {
            Logger.error("Error retrieving user interactions from DB:", "INTERACTION-SERVICE", error);
            return [];
        }
    }

    mapToStorage(interactions: UserInteraction[]): StorageInteraction[] {
        return interactions.map((interaction) => ({
            type: interaction.type.tag,
            priority: interaction.type.priority,
            bookId: interaction.bookId,
            timestamp: interaction.timestamp
        }));
    }

    mapFromStorage(data: any[]): UserInteraction[] {
        return data.map((interaction) => ({
            type: {
                tag: interaction.type,
                priority: interaction.priority
            },
            bookId: interaction.bookId.toString(),
            timestamp: new Date(interaction.timestamp)            
        }));
    }
}
