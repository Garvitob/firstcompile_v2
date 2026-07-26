"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Cal, { getCalApi } from "@calcom/embed-react";
import DemoCalendar from "./DemoCalendar";

const LINK_30 = process.env.NEXT_PUBLIC_CAL_LINK_30;
const LINK_15 = process.env.NEXT_PUBLIC_CAL_LINK_15;

function LiveCal() {
  const { resolvedTheme } = useTheme();
  const [dur, setDur] = useState<30 | 15>(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme: "light" | "dark" = resolvedTheme === "light" ? "light" : "dark";
  const ns = dur === 30 ? "intro30" : "intro15";
  const link = (dur === 30 ? LINK_30 : LINK_15 || LINK_30) as string;

  useEffect(() => {
    if (!mounted) return;
    (async () => {
      const api = await getCalApi({ namespace: ns });
      api("ui", {
        theme,
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": "#2c5fe6" },
          dark: { "cal-brand": "#6a95ff" },
        },
      });
    })();
  }, [mounted, ns, theme]);

  return (
    <div className="cal rv d1">
      <div className="cal-h">
        <div>
          <div className="cal-t">Intro call · FirstCompile</div>
          <div className="cal-s">Pick a weekday to see times</div>
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
      <div style={{ minHeight: 540 }}>
        {mounted && (
          <Cal
            key={`${ns}-${theme}`}
            namespace={ns}
            calLink={link}
            style={{ width: "100%", height: "100%" }}
            config={{ layout: "month_view", theme }}
          />
        )}
      </div>
      <div className="cal-f">
        <span className="cal-n">
          Times shown in your local timezone · Google Meet link arrives with the
          invite
        </span>
      </div>
    </div>
  );
}

export default function CalBooking() {
  if (!LINK_30) return <DemoCalendar />;
  return <LiveCal />;
}
