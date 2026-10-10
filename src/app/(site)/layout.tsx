import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import WhatsAppSubscribeModal from "@/components/whatsapp/WhatsAppSubscribeModal";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />

      <WhatsAppSubscribeModal
        phoneNumber={
          process.env.WHATSAPP_BUSINESS_NUMBER ??
          ""
        }
      />

    </>
  );
}