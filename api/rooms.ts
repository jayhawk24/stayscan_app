import { http } from "@/api/client";

export type Room = {
    id: string;
    roomNumber: string;
    roomType: string;
    accessCode: string;
    hotelId: string;
    isOccupied: boolean;
    currentBookingId: string | null;
    createdAt: string;
};

export async function fetchRooms() {
    const data = await http.get<{ success: boolean; rooms: Room[] }>("/rooms");
    return data.rooms;
}

export async function createRoom(input: {
    roomNumber: string;
    roomType: string;
}) {
    const data = await http.post<{ success: boolean; room: Room }>(
        "/rooms",
        input
    );
    return data.room;
}

export async function fetchRoom(id: string) {
    const data = await http.get<{ success: boolean; room: Room }>(
        `/rooms/${id}`
    );
    return data.room;
}
