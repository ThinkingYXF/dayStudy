public static void main(String[] args) {
 
    Configuration config = new Configuration();
    config.setPort(80);

    SocketIOServer server = new SocketIOServer(config);
        
    server.addConnectListener(new ConnectListener() {
        @Override
        public void onConnect(SocketIOClient client) {
            System.out.println("connect");
        }
    });
        
    MessageListener messageListener = new MessageListener();
    server.addEventListener("message", String.class,messageListener);
        
    MessageListener2 messageListener2 = new MessageListener2();
    messageListener2.setServer(server);
    server.addEventListener("message2", String.class,messageListener2);
        
    //启动服务
    server.start();
    System.out.println("start");
    try {
        Thread.sleep(Integer.MAX_VALUE) ;
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}