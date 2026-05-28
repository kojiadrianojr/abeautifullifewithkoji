import fs from "fs";
import path from "path";

interface Guest {
  id: string;
  groupName?: string;
  fullName?: string;
  members?: string[];
  allowedSeats: number;
  rsvpStatus: "pending" | "confirmed" | "declined";
  rsvpCount: number;
  rsvpDate: null;
  dietaryRestrictions: null;
  notes: null;
}

// Read guests.md
const guestsMdPath = path.join(process.cwd(), "guests.md");
const guestsMdContent = fs.readFileSync(guestsMdPath, "utf-8");

// Split by various dash types: --, -, –
const blocks = guestsMdContent
  .split(/--+|–+|-+/)
  .map((block) => block.trim())
  .filter((block) => block.length > 0);

const guests: Guest[] = [];
let id = 1;

blocks.forEach((block) => {
  const names = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (names.length === 0) return;

  if (names.length === 1) {
    // Single person entry
    guests.push({
      id: String(id),
      fullName: names[0],
      allowedSeats: 1,
      rsvpStatus: "pending",
      rsvpCount: 0,
      rsvpDate: null,
      dietaryRestrictions: null,
      notes: null,
    });
  } else {
    // Group entry
    // Extract last name from first person for group name
    const firstPersonName = names[0];
    const lastNameMatch = firstPersonName.match(/([A-Z][a-zñ]+)\s*$/);
    const lastName = lastNameMatch ? lastNameMatch[1] : "Group";

    // Determine if couple or family
    const groupType = names.length === 2 ? "Couple" : "Family";
    const groupName = `The ${lastName} ${groupType}`;

    guests.push({
      id: String(id),
      groupName,
      members: names,
      allowedSeats: names.length,
      rsvpStatus: "pending",
      rsvpCount: 0,
      rsvpDate: null,
      dietaryRestrictions: null,
      notes: null,
    });
  }

  id++;
});

// Create output object
const output = {
  guests,
  lastSyncedAt: new Date().toISOString(),
};

// Write to guests.json
const guestsJsonPath = path.join(process.cwd(), "config", "guests.json");
fs.writeFileSync(guestsJsonPath, JSON.stringify(output, null, 2));

console.log(`✓ Parsed ${guests.length} guests from guests.md`);
console.log(`✓ Wrote to ${guestsJsonPath}`);
