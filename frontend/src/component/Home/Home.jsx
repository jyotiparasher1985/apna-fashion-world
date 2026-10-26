

import { Box, HStack, Image, SimpleGrid, useMediaQuery, VStack } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from '../Navbar/Navbar';
import MobileNav from '../Navbar/MobileNav';

function Home() {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  return (
    <>

      {isLargerThan800 ? <Navbar /> : <MobileNav />}
      {/* ------------------------------------ Carousel 1 starts here ------------------------------------------------  */}
      <Box pt={10}>

        <Carousel
          className="carousel"
          autoPlay="true"
          infiniteLoop="true"
          interval="2000"
          showThumbs=""
        >
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-ClearanceSale.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-MainBanner-P7-ArrowUSPA-upto50.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-MainBanner-P4-FootwearCarnival-RedTapeFila-Flat60.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-MainBanner-P5-JohnplayerLeecooperAvaasa-Upto700On1000.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-MainBanner-P3-Casuals-CampusSutraVeroModa-Min60Extra30.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-MainBanner-P6-Home-HomeexpressionsStoryAtHome-5080.jpg"
              alt=""
            />
          </div>
        </Carousel>
      </Box>
      {/* ------------------------------------ Carousel 1 ends here ------------------------------------------------  */}

      <Box style={{ margin: "auto" }}>
        <Image style={{ width: "100vw" }} src="https://assets.ajio.com/cms/AJIO/WEB/D1-1440x90-11.jpg" />
        {/* HDFC BANK OFFER BANNER (IDBI ki jagah) */}
        <div style={{ width: "100%", background: "#fff", display: "flex", alignItems: "center", padding: "18px 4%", boxSizing: "border-box" }}>
          <div style={{ minWidth: "200px", textAlign: "center" }}>
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/HDFC-Bank-Logo.svg?width=420"
              alt="HDFC BANK"
              style={{ width: "210px", maxWidth: "100%", display: "block", margin: "0 auto" }}
            />
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#004c8f", letterSpacing: "2px", marginTop: "6px" }}>
              HDFC BANK
            </div>
            <div style={{ fontSize: "11px", color: "#555", fontWeight: 600, marginTop: "2px", fontStyle: "italic" }}>
              We Understand Your World
            </div>
          </div>
          <div style={{ width: "1px", background: "#999", alignSelf: "stretch", margin: "0 28px" }}></div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "clamp(14px, 1.6vw, 22px)", fontWeight: 800, color: "#0e7a4e", letterSpacing: "0.5px" }}>
              GET&nbsp; 10% INSTANT DISCOUNT<sup>*</sup> ON HDFC BANK DEBIT &amp; CREDIT CARDS
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#222", marginTop: "4px" }}>
              (*MIN. TRANSACTION: ₹2499 | MAX DISCOUNT: ₹500)
            </div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#f26a21", marginTop: "6px", cursor: "pointer" }}>
              CLICK TO KNOW MORE&gt;
            </div>
          </div>
        </div>
        <Image style={{ width: "100vw" }} src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-ASS-Teaser-Strip.gif" />
        <Image style={{ width: "100vw" }} src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-ASS-Teaser-HalfbannerRevised%20.gif" />
        <Image style={{ width: "100vw" }} src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SpecieUpYourBrandGame-SectionheaderStrip.jpg" />
      </Box>


      {/* ------------------------------------ Carousel 2 starts here ------------------------------------------------  */}
      <Carousel
        className="carousel"
        autoPlay="true"
        infiniteLoop="true"
        interval="2000"
        showThumbs=""
      >
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/22022023-UHP-D-Daily%20Deals%20-P2-Brands-30-50--.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-TopBanner-P2-CasualFootwear-ActionBucik-Under999Extra30.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-TopBanner-P3-Kids-KBTSKFFrendz-Min50.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-TopBanner-P4-Puma-Min40.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-TopBanner-P5-Western-VeromodaThebearhouse-flat60extraupto35.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-TopBanner-P7-HiFashionFits-SuperdryAx-3050.jpg"
            alt=""
          />
        </div>
      </Carousel>
      {/* ------------------------------------ Carousel 2 ends here ------------------------------------------------  */}


      {/* ------------------------------------ Carousel of paytm starts here ------------------------------------------------  */}
      <Carousel
        className="carousel"
        autoPlay="true"
        infiniteLoop="true"
        interval="2000"
        showThumbs=""
      >
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/1440x128-Paytmm.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/Mobikwik-1440x128-23.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-BankOffer-PayUpto3.jpg"
            alt=""
          />
        </div>
      </Carousel>
      {/* ------------------------------------ Carousel of paytm ends here ------------------------------------------------  */}

      {/* -------------------------------- block 1 starts here ------------------------------------------------------- */}
      <HStack width="100vw" justifyContent={'center'} alignItems='center' m='auto'  >
        <Image width="100%" src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SS23-HalfBanner%20.gif" />
      </HStack>

      <Box>
        <HStack justifyContent={'center'} alignItems='center' m='auto'>

          <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-Sectionheader.jpg" />
        </HStack>
        <SimpleGrid columns={{ base: 2, md: 4 }}>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
        </SimpleGrid>
      </Box>
      {/* --------------------------------------block 1 ends here ------------------------------------------ */}

      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-SectionHeader.jpg" />
      </Box>

      <Box>
        <Image src="" />
        <SimpleGrid columns={{ base: 2, md: 4 }}>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P1-Puma-4060.jpg" />
          </Box>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P2-Levis-Flat50Extra10.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P3-Adidas-4060.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P4-Campus-Upto60.jpg" />
          </Box>
        </SimpleGrid>
      </Box>
      {/* --------------------------------------block 2 ends here ------------------------------------------ */}
      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FlashDealsHeaderStrip.jpg" />
      </Box>
      {/* --------------------------------------Carousel 3 starts here ------------------------------------------ */}
      <Carousel
        className="carousel"
        autoPlay="true"
        infiniteLoop="true"
        interval="2000"
        showThumbs=""
      >
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-Flash%20Deals%20-P8-Brands-Flat60.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-UHP-D-Flash%20Deals%20-P9-Brands-Min40.jpg"
            alt=""
          />
        </div>
      </Carousel>
      {/* --------------------------------------Carousel 3 ends here ------------------------------------------ */}


      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-SectionHeader.jpg" />
        <SimpleGrid columns={{ base: 2, md: 4 }}>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P1-Puma-4060.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Rewards-EarnUpto5.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-SponsorBrands-P2-Levis-Flat50Extra10.jpg" />
          </Box>
        </SimpleGrid>
      </Box>
      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FlashDealsHeaderStrip.jpg" />
      </Box>
      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/MicrosoftTeams-image-free-d.png" />
      </Box>

      {/* ------------------------------------------------ 2 Carousel starts here--------------------------------------------- */}
      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-ForHER-Sectionheader.jpg" />
      </Box>

      <Carousel
        className="carousel"
        autoPlay="true"
        infiniteLoop="true"
        interval="2000"
        showThumbs=""
      >
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-d-mhp-uhphim-p1-brands-flat60.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-d-mhp-uhphim-p2-brands-min65.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-d-mhp-uhphim-p3-brands-3080.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-d-mhp-uhphim-p4-brands-starting699.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://assets.ajio.com/cms/AJIO/WEB/24022023-d-mhp-uhphim-p5-brands-starting999.jpg"
            alt=""
          />
        </div>
      </Carousel>

      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-ForHIM-Sectionheader.jpg" />
      </Box>

      {/* ------------------------------------------------ 2 Carousel ends here--------------------------------------------- */}
      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FEthnicwear-Sectionheader.jpg" />
        <SimpleGrid columns={{ base: 2, md: 4 }}>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FEthnicwear-P1-KurtiKurtaSets-AvaasaGlamroos-Starting599.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FEthnicwear-P2-Sarees-IndiePicksHritika-Starting432.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FEthnicwear-P3-handbags-Brands-Starting499.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-FEthnicwear-P4-Jewellery-Brands-Upto80.jpg" />
          </Box>
        </SimpleGrid>
      </Box>

      <Box>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Home-Sectionheader.jpg" />
        <SimpleGrid columns={{ base: 2, md: 4 }}>
          <Box>
            {" "}
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Home-P1-QuiltsComforters-StoryRaymond-Upto80.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Home-P2-Decor-Brands-Starying199.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Home-P3-Home-goodhomesHomesizzler-upto80.jpg" />
          </Box>
          <Box>
            <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-Home-P4-Portico-upto50.jpg" />
          </Box>
        </SimpleGrid>
      </Box>
      {/* -----------------------------------------------block of 7*4 ended ------------------------------------------------------- */}
      <VStack>
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-OnlineStores-Sectionheader.jpg" />
        <Image src="https://assets.ajio.com/cms/AJIO/WEB/D-UHP-OnlineStores-AJIOGOLD.jpg" />
      </VStack>
    </>
  );
}

export default Home;
