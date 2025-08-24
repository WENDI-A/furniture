import React from "react";

// Import all images from the Assets folder
import AvantGardeLamp from "./Assets/avantGardeLamp.jpg";
import ChicChair from "./Assets/chicChair.jpg";
import CoffeTable from "./Assets/coffeTable.jpg";
import ComfyBed from "./Assets/comfyBed.jpg";
import ContemporarySofa from "./Assets/contemporarySofa.jpg";
import CuttingEdgeBed from "./Assets/cuttingEdgeBed.jpg";
import FuturisticShelves from "./Assets/futuristicShelves.jpg";
import GlassTable from "./Assets/glassTable.jpg";
import KingBed from "./Assets/kingBed.jpg";
import LoungChair from "./Assets/loungChair.jpg";
import MinimalistShelves from "./Assets/minimalistShelves.jpg";
import ModernSofa from "./Assets/modernSofa.jpg";
import ModernTable from "./Assets/modernTable.jpg";
import RecliningSofa from "./Assets/recliningSofa.jpg";
import SectionSofa from "./Assets/sectionSofa.jpg";
import SleekBed from "./Assets/sleekBed.jpg";
import SleekChair from "./Assets/sleekChair.jpg";
import StramlinedTable from "./Assets/stramlinedTable.jpg";
import StylishBed from "./Assets/stylishBed.jpg";
import ToyShelf from "./Assets/toyShelf.jpg";
import hoteltable from "./Assets/hoteltable.jpg";
import hoteltv from "./Assets/hoteltv.jpg";
import VelvetSofa from "./Assets/velvetSofa.jpg";
import WoodenShelves from "./Assets/woodenShelves.jpg";

// Export all images as named exports
export {
  AvantGardeLamp,
  ChicChair,
  CoffeTable,
  ComfyBed,
  ContemporarySofa,
  CuttingEdgeBed,
  FuturisticShelves,
  GlassTable,
  KingBed,
  LoungChair,
  MinimalistShelves,
  ModernSofa,
  ModernTable,
  RecliningSofa,
  SectionSofa,
  SleekBed,
  SleekChair,
  StramlinedTable,
  StylishBed,
  ToyShelf,
  hoteltable,
  hoteltv,
  VelvetSofa,
  WoodenShelves,
};

// Create a React functional component
function Index() {
  return (
    <div>
      <h1>Available Products</h1>
      {/* Displaying some example images */}
      <div>
        <img
          src={AvantGardeLamp}
          alt="Avant Garde Lamp"
          style={{ width: "200px" }}
        />
        <img src={ChicChair} alt="Chic Chair" style={{ width: "200px" }} />
        <img src={CoffeTable} alt="Coffee Table" style={{ width: "200px" }} />
      </div>
    </div>
  );
}

// Export the component as default
export default Index;
