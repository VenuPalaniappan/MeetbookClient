
import { useContext,useState,useEffect } from "react";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
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
  { value: "married", label: "Married",        desc: "Show your marriage status" },
  { value: "city", label: "City",      desc: "Show your current city" },
 
];


const PROFILE_FIELD_RULES = {
  email:    { on: "public",  off: "only_me", settingKey: "emailVisibility" },
  birthday: { on: "friends", off: "only_me", settingKey: "birthdayVisibility" },
  married:  { on: "public",  off: "only_me", settingKey: "marriedVisibility" },
  city:     { on: "public",  off: "only_me", settingKey: "cityVisibility" },  
};

function AudiencePickerModal({ open, value, onClose, onDone }) {
  const [picked, setPicked] = useState(value);
  useEffect(() => { if (open) setPicked(value); }, [open, value]);
  if (!open) return null;

   return (
    <div className="aud-modal">
      <div className="aud-dialog">
        <div className="aud-dialog-header">
          <div className="aud-dialog-title">Select audience</div>
          <button className="aud-close" onClick={onClose}>✕</button>
        </div>

        <div className="aud-dialog-body">
          {OPTIONS.map((opt) => (
            <div key={opt.value} className="aud-toggle-row">
              <div className="aud-radio-text">
                <div className="aud-radio-title">{opt.label}</div>
                <div className="aud-radio-desc">{opt.desc}</div>
              </div>
              {/* Exclusive: turning one ON selects it; turning OFF does nothing */}
              <Toggle checked={picked === opt.value} onChange={(next) => { if (next) setPicked(opt.value); }} />
            </div>
          ))}
        </div>

        <div className="aud-dialog-actions">
          <button className="link-btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onDone(picked)}>Done</button>
        </div>
      </div>
    </div>
  );
}
  
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
  const marriedVisibility = data?.marriedVisibility ?? "only_me";
  const cityVisibility = data?.cityVisibility ?? "only_me";
  const friendsListVisibility = data?.friendsListVisibility ?? "friends";
  const followingVisibility   = data?.followingVisibility   ?? "friends";

  const visibilityMap = {
    email:    emailVisibility,
    birthday: birthdayVisibility,
    married:  marriedVisibility,
    city:     cityVisibility,
  };

  const updateSetting = useMutation({
    mutationFn: (payload) => makeRequest.put("/settings", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "audience"] }),
  });

  const [picker, setPicker] = useState({ open: false, key: null, value: null });
  const openPicker  = (key, value) => setPicker({ open: true, key, value });
  const closePicker = () => setPicker({ open: false, key: null, value: null });
  const savePicker  = (val) => {
    updateSetting.mutate({ settingKey: picker.key, settingValue: val });
    closePicker();
  };

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
              if (!rule) return null;
              const currentValue = visibilityMap[item.value];
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
      <div className="aud-subtitle">Friends and following</div>
          <div className="aud-list">
            <button
              className="aud-row aud-click"
              onClick={() => openPicker("friendsListVisibility", friendsListVisibility)}
            >
              <div className="aud-left">
                <div className="aud-title">Who can see your friends list?</div>
                <div className="aud-desc">
                  {friendsListVisibility[0].toUpperCase() + friendsListVisibility.slice(1)}
                </div>
              </div>
              <span className="aud-chevron">›</span>
            </button>

            <button
              className="aud-row aud-click"
              onClick={() => openPicker("followingVisibility", followingVisibility)}
            >
              <div className="aud-left">
                <div className="aud-title">Who can see the people, Pages and lists you follow?</div>
                <div className="aud-desc">
                  {followingVisibility[0].toUpperCase() + followingVisibility.slice(1)}
                </div>
              </div>
              <span className="aud-chevron">›</span>
            </button>
          </div>

          {/* Minimal modal — same page */}
          <AudiencePickerModal
            open={picker.open}
            value={picker.value}
            onClose={closePicker}
            onDone={savePicker}
          />
        </>
      )}

      <div className="muted">You can still override per-post in the composer.</div>
    </div>
  );
}
