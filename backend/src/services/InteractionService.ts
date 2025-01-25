import { UserInteraction, InteractionTypes } from "@app/interfaces/User"
import { ValidationResponse } from "@app/interfaces/Util"
import { isISO8601 } from "@app/utils"

export const validateInteractions = (interactions: UserInteraction[]): ValidationResponse => {
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
