import { createSelector } from "@ngrx/store";
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IgExampleMessages } from "src/app/modules/example-messages/domain/example-messages.model";

export const selectIgExampleMessages = createSelector(
    fromDam.selectPayloadData,
    (state: IgExampleMessages) => {
        return state;
    },
);