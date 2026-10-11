// TODO: Update mapping when backend confirms exact routeStops structure

export interface MappedStop {
  id: string | number;
  formattedSequence: string;
  stopName: string;
  rawSequence: number;
  pickupTime?: string;
  dropTime?: string;
}

/**
 * Maps raw routeStops array from API into a consistent MappedStop format.
 * Handles variations in property names (stopName vs name, sequence vs sequenceOrder vs id).
 */
export const mapRouteStops = (stops: any[] = []): MappedStop[] => {
  if (!Array.isArray(stops)) return [];

  return stops.map((stop, index) => {
    const rawSeq = stop.sequenceOrder ?? stop.sequence ?? (index + 1);
    const formattedSeq = String(index + 1).padStart(2, '0');
    const name = stop.stopName || stop.name || stop.stop_name || `Stop ${index + 1}`;
    const id = stop.id || stop.stopId || `stop_${index + 1}`;

    return {
      id,
      formattedSequence: formattedSeq,
      stopName: name,
      rawSequence: rawSeq,
      pickupTime: stop.pickupTime || stop.pickup_time,
      dropTime: stop.dropTime || stop.drop_time,
    };
  });
};
