
import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import "./audiencesetting.scss";
import Toggle from "../../components/toggle/Toggle";

const OPTIONS = [
  { value: "public",           label: "Public",            desc: "Anyone on or off MeetBook" },
  { value: "friends",          label: "Friends",           desc: "Only your friends" },
  { value: "friends_except",   label: "Friends except…",   desc: "Hide from specific friends" },
  { value: "specific_friends", label: "Specific friends",  desc: "Only selected friends" },
  { value: "only_me",          label: "Only me",           desc: "Visible only to you" },
];


const OPTIONS1 = [
  { value: "email",    label: "Email address", desc: "Show your email" },
  { value: "birthday", label: "Birthday",      desc: "Show your birthday" },
];


const PROFILE_FIELD_RULES = {
  email:    { on: "public",  off: "only_me", settingKey: "emailVisibility" },
  birthday: { on: "friends", off: "only_me", settingKey: "birthdayVisibility" },
};

export default function AudienceSettings() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { currentUser } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings", "audience"],
    queryFn: () => makeRequest.get("/settings").then((r) => r.data),
  });


  const current = data?.defaultAudience ?? "friends";
  const emailVisibility = data?.emailVisibility ?? "only_me";
  const birthdayVisibility = data?.birthdayVisibility ?? "only_me";

  const updateSetting = useMutation({
    mutationFn: (payload) => makeRequest.put("/settings", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "audience"] }),
  });

  return (
    <div className="audience-page">
      <div className="aud-header">
        <button className="link-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Who Can See What You Share</h1>
        <p>Choose the default audience for your profile info and new posts.</p>
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className="link-btn">
            View your profile →
          </Link>
        )}
      </div>

      {isLoading && <div className="muted">Loading…</div>}
      {isError && <div className="muted">Failed to load settings.</div>}

      {!isLoading && !isError && (
        <>
        
          <div className="aud-list">
            {OPTIONS.map((opt) => (
              <div key={opt.value} className="aud-row">
                <div className="aud-left">
                  <div className="aud-title">{opt.label}</div>
                  <div className="aud-desc">{opt.desc}</div>
                </div>

                <Toggle
                  checked={current === opt.value}
                  onChange={(next) => {
                    if (next && current !== opt.value) {
                      updateSetting.mutate({
                        settingKey: "defaultAudience",
                        settingValue: opt.value,
                      });
                    }
                  }}
                  disabled={updateSetting.isPending}
                />
              </div>
            ))}
          </div>

        
          <div className="aud-subtitle">Profile Information</div>
          <div className="aud-list">
            {OPTIONS1.map((item) => {
              const rule = PROFILE_FIELD_RULES[item.value];
              const currentValue =
                item.value === "email" ? emailVisibility : birthdayVisibility;
              const isOn = currentValue === rule.on;

              return (
                <div key={item.value} className="aud-row">
                  <div className="aud-left">
                    <div className="aud-title">{item.label}</div>
                    <div className="aud-desc">{item.desc}</div>
                  </div>

                  <Toggle
                    checked={isOn}
                    onChange={(next) => {
                      updateSetting.mutate({
                        settingKey: rule.settingKey,
                        settingValue: next ? rule.on : rule.off,
                      });
                    }}
                    disabled={updateSetting.isPending}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="muted">You can still override per-post in the composer.</div>
    </div>
  );
}
