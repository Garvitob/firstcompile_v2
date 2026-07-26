"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TIMES = ["09:30", "10:30", "11:30", "14:00", "15:30", "17:00", "18:30", "20:00"];

/**
 * The contract's demo calendar, ported behaviour-for-behaviour. Rendered only
 * when NEXT_PUBLIC_CAL_LINK_30 is not configured (local dev / preview), so the
 * booking panel never looks broken. Production uses the real Cal.com embed.
 */
export default function DemoCalendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<Date | null>(null);
  const [pick, setPick] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [dur, setDur] = useState(30);
  const [zone, setZone] = useState("your timezone");
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const now = new Date();
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    setView(new Date(now.getFullYear(), now.getMonth(), 1));
    try {
      setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setZone("local time");
    }
  }, []);

  const bookable = (d: Date) => {
    const w = d.getDay();
    return w !== 0 && w !== 6 && today !== null && d >= today;
  };

  const move = (delta: number) => {
    if (!view) return;
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1));
    setPick(null);
    setSlot(null);
  };

  const days: (Date | null)[] = [];
  if (view) {
    const first = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= count; d++)
      days.push(new Date(view.getFullYear(), view.getMonth(), d));
  }

  const ready = !!(pick && slot);
  const sub = pick ? `${dur} minutes · Google Meet` : "Pick a weekday to see times";
  const note = booked
    ? `Confirmed · ${pick!.getDate()} ${MONTHS[pick!.getMonth()]} at ${slot} · check your email`
    : ready
      ? "Google Meet link sent on confirmation"
      : "Design preview · live booking is connected in production";

  return (
    <div className="cal rv d1">
      <div className="cal-h">
        <div>
          <div className="cal-t">Intro call · FirstCompile</div>
          <div className="cal-s" id="calSub">
            {sub}
          </div>
        </div>
        <div className="dur" role="group" aria-label="Call length">
          <button
            type="button"
            data-d="30"
            aria-pressed={dur === 30}
            onClick={() => setDur(30)}
          >
            30 min
          </button>
          <button
            type="button"
            data-d="15"
            aria-pressed={dur === 15}
            onClick={() => setDur(15)}
          >
            15 min
          </button>
        </div>
      </div>
      <div className="cal-b">
        <div className="cal-m">
          <div className="cal-mh">
            <b id="calMonth">
              {view ? `${MONTHS[view.getMonth()]} ${view.getFullYear()}` : "Month"}
            </b>
            <span className="cal-nav">
              <button
                type="button"
                id="prevM"
                aria-label="Previous month"
                onClick={() => move(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                id="nextM"
                aria-label="Next month"
                onClick={() => move(1)}
              >
                ›
              </button>
            </span>
          </div>
          <div className="cgrid" id="cgrid">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div className="dow" key={`${d}${i}`}>
                {d}
              </div>
            ))}
            {days.map((date, i) =>
              date === null ? (
                <div key={`pad${i}`} />
              ) : (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={`cday${
                    pick && date.getTime() === pick.getTime() ? " on" : ""
                  }`}
                  disabled={!bookable(date) || booked}
                  onClick={() => {
                    setPick(date);
                    setSlot(null);
                  }}
                >
                  {date.getDate()}
                </button>
              )
            )}
          </div>
        </div>
        <div className="slots">
          <div className="slots-t" id="slotT">
            {pick
              ? `${pick.getDate()} ${MONTHS[pick.getMonth()].slice(0, 3)} ${pick.getFullYear()}`
              : "Available times"}
          </div>
          <div className="slots-z" id="slotZ">
            {zone}
          </div>
          <div className="slot-list" id="slotList">
            {!pick ? (
              <div className="slots-hint">Pick a weekday on the left.</div>
            ) : (
              TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`slot${slot === t ? " on" : ""}`}
                  disabled={booked}
                  onClick={() => setSlot(t)}
                >
                  {t}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="cal-f">
        <span className="cal-n" id="calNote">
          {note}
        </span>
        <button
          className="btn btn-pri btn-sm"
          id="calGo"
          type="button"
          disabled={!ready || booked}
          onClick={() => {
            if (ready) setBooked(true);
          }}
        >
          {booked ? "Booked" : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}
