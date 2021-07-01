/* export class StatusEnum {

    statusEnum: string;

    StatusEnum(status: string) {
        this.statusEnum = status;
    }
} */

export enum TaskStatus {
    Created = 'Created',
    Finished = 'Finished',
    Executing = 'Executing',
    Cancelled = 'Cancelled'
}
