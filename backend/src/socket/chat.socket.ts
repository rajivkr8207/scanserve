

export const handleSocketChat = (socket: any) => {
    socket.on("send_message", async (data: any) => {
        try {
            const { message, chatid, useri } = data;

            socket.emit("typing", true);

            socket.emit("typing", false);
            socket.emit("receive_message", {});

        } catch (err) {
            console.error(err);
            socket.emit("error", "Something went wrong");
        }
    });
};