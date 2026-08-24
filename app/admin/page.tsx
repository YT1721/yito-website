"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type {
  IconName,
  SiteContent,
  ScrollWorldScene,
  VisualBlock,
  WorkVideo,
} from "../../lib/content-types";
import initialContent from "../../content/site.json";
import ImageWithFallback from "../../components/ImageWithFallback";

const iconOptions: IconName[] = [
  "sparkles",
  "clapperboard",
  "film",
  "pen",
  "boxes",
  "gauge",
  "badge",
  "wand",
];

type ImageGuide = {
  usage: string;
  ratio: string;
  size: string;
  note: string;
};

const imageGuides = {
  hero: {
    usage: "首页首屏主视觉",
    ratio: "16:9",
    size: "1920×1080",
    note: "主体建议放在画面中间偏右，左侧需给标题留暗部空间。",
  },
  wide: {
    usage: "大幅横向视觉",
    ratio: "16:9",
    size: "1920×1080",
    note: "适合人物、空间、产品场景，重要信息避免贴边。",
  },
  service: {
    usage: "服务卡片封面",
    ratio: "4:3",
    size: "1200×900",
    note: "画面会在卡片内裁切，主体放中间最稳。",
  },
  selected: {
    usage: "精选案例竖版卡片",
    ratio: "3:4",
    size: "1200×1600",
    note: "适合竖构图海报，标题和主体避免贴近上下边缘。",
  },
  caseMain: {
    usage: "案例详情主图",
    ratio: "16:9",
    size: "1920×1080",
    note: "首页案例板块和详情页都会使用，建议保持电影横幅构图。",
  },
  caseThumb: {
    usage: "案例缩略图",
    ratio: "16:9",
    size: "960×540",
    note: "缩略图较小，主体要清晰，不建议放过多文字。",
  },
  scrollPoster: {
    usage: "Scroll World 首屏 Poster",
    ratio: "16:9",
    size: "1920×1080",
    note: "作为视频加载前和失败时的兜底画面，左侧需保留文字安全区。",
  },
} satisfies Record<string, ImageGuide>;

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(
    initialContent as SiteContent,
  );
  const [status, setStatus] = useState("已加载本地默认内容");
  const [active, setActive] = useState("hero");
  const [advancedJson, setAdvancedJson] = useState("");
  const scrollWorld = content.scrollWorld ?? createEmptyScrollWorld();

  const sections = useMemo(
    () => [
      ["hero", "首页首屏"],
      ["scrollWorld", "滚动视觉"],
      ["about", "关于我们"],
      ["services", "服务管理"],
      ["works", "精选案例"],
      ["cases", "案例详情"],
      ["studio", "AI生产系统"],
      ["process", "工作流程"],
      ["why", "选择理由"],
      ["clients", "客户行业"],
      ["contact", "联系方式"],
      ["footer", "页脚信息"],
      ["advanced", "高级 JSON"],
    ],
    [],
  );

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: SiteContent) => {
        setContent(data);
        setStatus("已同步最新网站内容");
      })
      .catch(() => setStatus("读取最新内容失败，正在使用本地默认内容"));
  }, []);

  useEffect(() => {
    setAdvancedJson(JSON.stringify(content, null, 2));
  }, [content]);

  function update(mutator: (draft: SiteContent) => void) {
    setContent((current) => {
      const next = structuredClone(current);
      mutator(next);
      return next;
    });
    setStatus("有未保存修改");
  }

  async function save() {
    setStatus("正在保存...");
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      setStatus("保存失败，请检查终端日志");
      return;
    }

    setStatus("保存成功，已发布到前台；刷新页面即可看到最新内容");
  }

  function applyJson() {
    try {
      setContent(JSON.parse(advancedJson) as SiteContent);
      setStatus("JSON 已应用，记得保存");
    } catch {
      setStatus("JSON 格式不正确，暂未应用");
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <Image
            src="/yito-logo-white-v2.png"
            alt="YITO visual logo"
            width={42}
            height={42}
          />
          <span>YITO CMS</span>
        </Link>
        <nav>
          {sections.map(([id, label]) => (
            <button
              key={id}
              className={active === id ? "is-active" : ""}
              onClick={() => setActive(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-status">
          <p>{status}</p>
          <button onClick={save}>保存所有修改</button>
          <Link href="/" target="_blank">
            打开前台
          </Link>
        </div>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <p>Content Operations</p>
            <h1>网站后台管理系统</h1>
          </div>
          <button onClick={save}>保存并发布</button>
        </div>

        {active === "hero" && (
          <Panel title="Hero 首屏" intro="修改首页第一屏标题、按钮和主视觉。">
            <Grid>
              <Field
                label="章节编号"
                value={content.hero.no}
                onChange={(value) => update((d) => void (d.hero.no = value))}
              />
              <Field
                label="视觉标签"
                value={content.hero.visualLabel}
                onChange={(value) =>
                  update((d) => void (d.hero.visualLabel = value))
                }
              />
            </Grid>
            <TextArea
              label="主标题"
              value={content.hero.title}
              onChange={(value) => update((d) => void (d.hero.title = value))}
            />
            <Field
              label="英文副标题"
              value={content.hero.subtitle}
              onChange={(value) =>
                update((d) => void (d.hero.subtitle = value))
              }
            />
            <Field
              label="中文定位"
              value={content.hero.positioning ?? ""}
              onChange={(value) =>
                update((d) => void (d.hero.positioning = value))
              }
            />
            <TextArea
              label="首页主文案"
              value={content.hero.description ?? ""}
              onChange={(value) =>
                update((d) => void (d.hero.description = value))
              }
            />
            <TextArea
              label="首页补充说明"
              value={content.hero.note ?? ""}
              onChange={(value) => update((d) => void (d.hero.note = value))}
            />
            <TextArea
              label="小标签（每行一个）"
              value={(content.hero.tags ?? []).join("\n")}
              onChange={(value) =>
                update((d) => void (d.hero.tags = lines(value)))
              }
            />
            <Grid>
              <Field
                label="主按钮"
                value={content.hero.primaryCta}
                onChange={(value) =>
                  update((d) => void (d.hero.primaryCta = value))
                }
              />
              <Field
                label="副按钮"
                value={content.hero.secondaryCta}
                onChange={(value) =>
                  update((d) => void (d.hero.secondaryCta = value))
                }
              />
            </Grid>
            <VisualEditor
              block={content.hero}
              imageGuide={imageGuides.hero}
              onChange={(patch) => update((d) => Object.assign(d.hero, patch))}
            />
          </Panel>
        )}

        {active === "scrollWorld" && (
          <Panel
            title="Scroll World 滚动视觉"
            intro="配置首页首屏滚动驱动视频样机；关闭后自动使用普通 Hero。"
          >
            <Grid>
              <SelectField
                label="启用滚动视频"
                value={scrollWorld.enabled ? "true" : "false"}
                options={["false", "true"]}
                onChange={(value) =>
                  update((d) => {
                    d.scrollWorld ??= createEmptyScrollWorld();
                    d.scrollWorld.enabled = value === "true";
                  })
                }
              />
              <SelectField
                label="视频失败兜底方式"
                value={scrollWorld.fallbackMode}
                options={["poster", "static"]}
                onChange={(value) =>
                  update((d) => {
                    d.scrollWorld ??= createEmptyScrollWorld();
                    d.scrollWorld.fallbackMode =
                      value === "static" ? "static" : "poster";
                  })
                }
              />
            </Grid>
            <Grid>
              <Field
                label="样机标题"
                value={scrollWorld.introTitle}
                onChange={(value) =>
                  update((d) => {
                    d.scrollWorld ??= createEmptyScrollWorld();
                    d.scrollWorld.introTitle = value;
                  })
                }
              />
              <Field
                label="样机副标题"
                value={scrollWorld.introSubtitle}
                onChange={(value) =>
                  update((d) => {
                    d.scrollWorld ??= createEmptyScrollWorld();
                    d.scrollWorld.introSubtitle = value;
                  })
                }
              />
            </Grid>
            <Field
              label="桌面视频 URL（16:9，建议 1280×720 MP4）"
              value={scrollWorld.desktopVideo}
              onChange={(value) =>
                update((d) => {
                  d.scrollWorld ??= createEmptyScrollWorld();
                  d.scrollWorld.desktopVideo = value;
                })
              }
            />
            <UploadOnly
              label="上传桌面视频（MP4/WebM/MOV，第一阶段建议 720p）"
              accept="video/mp4,video/webm,video/quicktime"
              onUploaded={(url) =>
                update((d) => {
                  d.scrollWorld ??= createEmptyScrollWorld();
                  d.scrollWorld.desktopVideo = url;
                })
              }
            />
            <Field
              label="移动视频 URL（可选，9:16）"
              value={scrollWorld.mobileVideo ?? ""}
              onChange={(value) =>
                update((d) => {
                  d.scrollWorld ??= createEmptyScrollWorld();
                  d.scrollWorld.mobileVideo = value;
                })
              }
            />
            <VisualEditor
              block={{ image: scrollWorld.poster }}
              imageGuide={imageGuides.scrollPoster}
              onChange={(patch) =>
                update((d) => {
                  d.scrollWorld ??= createEmptyScrollWorld();
                  d.scrollWorld.poster = patch.image || "";
                })
              }
            />
            <ScrollWorldSceneEditor
              scenes={scrollWorld.scenes ?? defaultScrollWorldScenes()}
              services={content.services.items}
              onChange={(scenes) =>
                update((d) => {
                  d.scrollWorld ??= createEmptyScrollWorld();
                  d.scrollWorld.scenes = scenes;
                })
              }
            />
            <p className="admin-help">
              推荐流程：先用 GPT 生成 1920×1080 poster，再用即梦 CLI 生成 720p
              横版视频。视频未生成前可保持关闭或使用 poster fallback。
            </p>
          </Panel>
        )}

        {active === "about" && (
          <Panel
            title="About 关于"
            intro="修改工作室介绍、能力标签和右侧主视觉。"
          >
            <Grid>
              <Field
                label="章节编号"
                value={content.about.no}
                onChange={(value) => update((d) => void (d.about.no = value))}
              />
              <Field
                label="标题"
                value={content.about.title}
                onChange={(value) =>
                  update((d) => void (d.about.title = value))
                }
              />
            </Grid>
            <Field
              label="副标题"
              value={content.about.subtitle}
              onChange={(value) =>
                update((d) => void (d.about.subtitle = value))
              }
            />
            <TextArea
              label="介绍正文"
              value={content.about.body}
              onChange={(value) => update((d) => void (d.about.body = value))}
            />
            <TextArea
              label="能力标签（每行一个）"
              value={content.about.capabilities.join("\n")}
              onChange={(value) =>
                update((d) => void (d.about.capabilities = lines(value)))
              }
            />
            <TextArea
              label="底部观点"
              value={content.about.statement}
              onChange={(value) =>
                update((d) => void (d.about.statement = value))
              }
            />
            <Field
              label="视觉标签"
              value={content.about.visualLabel}
              onChange={(value) =>
                update((d) => void (d.about.visualLabel = value))
              }
            />
            <VisualEditor
              block={content.about}
              imageGuide={imageGuides.wide}
              onChange={(patch) => update((d) => Object.assign(d.about, patch))}
            />
          </Panel>
        )}

        {active === "services" && (
          <Panel
            title="Services 服务"
            intro="添加、删除、排序服务卡片，替换每张卡片封面。"
          >
            <SectionFields
              no={content.services.no}
              title={content.services.title}
              subtitle={content.services.subtitle}
              onChange={(field, value) =>
                update(
                  (d) =>
                    void ((d.services as unknown as Record<string, string>)[
                      field
                    ] = value),
                )
              }
            />
            <TextArea
              label="模块说明"
              value={content.services.microCopy}
              onChange={(value) =>
                update((d) => void (d.services.microCopy = value))
              }
            />
            <Stack>
              {content.services.items.map((item, index) => (
                <EditableCard
                  key={`${item.title}-${index}`}
                  title={`服务 ${index + 1}`}
                  onRemove={() =>
                    update((d) => d.services.items.splice(index, 1))
                  }
                  onMoveUp={() =>
                    update((d) => move(d.services.items, index, index - 1))
                  }
                  onMoveDown={() =>
                    update((d) => move(d.services.items, index, index + 1))
                  }
                >
                  <Grid>
                    <Field
                      label="中文名称"
                      value={item.title}
                      onChange={(value) =>
                        update(
                          (d) => void (d.services.items[index].title = value),
                        )
                      }
                    />
                    <Field
                      label="英文说明"
                      value={item.en}
                      onChange={(value) =>
                        update((d) => void (d.services.items[index].en = value))
                      }
                    />
                  </Grid>
                  <TextArea
                    label="服务说明"
                    value={item.description ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.services.items[index].description =
                            value || undefined),
                      )
                    }
                  />
                  <Field
                    label="适用场景"
                    value={item.scenes ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.services.items[index].scenes =
                            value || undefined),
                      )
                    }
                  />
                  <SelectField
                    label="图标"
                    value={item.icon}
                    options={iconOptions}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.services.items[index].icon =
                            value as IconName),
                      )
                    }
                  />
                  <VisualEditor
                    block={item}
                    imageGuide={imageGuides.service}
                    onChange={(patch) =>
                      update((d) =>
                        Object.assign(d.services.items[index], patch),
                      )
                    }
                  />
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) =>
                    d.services.items.push({
                      title: "新服务",
                      en: "Service",
                      description: "填写服务说明。",
                      scenes: "填写适用场景。",
                      icon: "sparkles",
                    }),
                  )
                }
              >
                添加服务
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "works" && (
          <Panel title="Selected Works 精选案例" intro="管理精选案例入口卡片。">
            <SectionFields
              no={content.selectedWorks.no}
              title={content.selectedWorks.title}
              subtitle={content.selectedWorks.subtitle}
              onChange={(field, value) =>
                update(
                  (d) =>
                    void ((
                      d.selectedWorks as unknown as Record<string, string>
                    )[field] = value),
                )
              }
            />
            <TextArea
              label="模块介绍"
              value={content.selectedWorks.intro}
              onChange={(value) =>
                update((d) => void (d.selectedWorks.intro = value))
              }
            />
            <Field
              label="链接文字"
              value={content.selectedWorks.linkText}
              onChange={(value) =>
                update((d) => void (d.selectedWorks.linkText = value))
              }
            />
            <TextArea
              label="案例分类标签（每行一个）"
              value={(content.selectedWorks.categories ?? []).join("\n")}
              onChange={(value) =>
                update((d) => void (d.selectedWorks.categories = lines(value)))
              }
            />
            <Stack>
              {content.selectedWorks.items.map((item, index) => (
                <EditableCard
                  key={`${item.title}-${index}`}
                  title={`精选案例 ${index + 1}`}
                  onRemove={() =>
                    update((d) => d.selectedWorks.items.splice(index, 1))
                  }
                  onMoveUp={() =>
                    update((d) => move(d.selectedWorks.items, index, index - 1))
                  }
                  onMoveDown={() =>
                    update((d) => move(d.selectedWorks.items, index, index + 1))
                  }
                >
                  <Grid>
                    <Field
                      label="标题"
                      value={item.title}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.selectedWorks.items[index].title = value),
                        )
                      }
                    />
                    <Field
                      label="标签"
                      value={item.en}
                      onChange={(value) =>
                        update(
                          (d) => void (d.selectedWorks.items[index].en = value),
                        )
                      }
                    />
                  </Grid>
                  <SelectField
                    label="关联详情页"
                    value={item.caseSlug ?? ""}
                    options={[
                      "",
                      ...content.caseStudies.map((caseItem) => caseItem.slug),
                    ]}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.selectedWorks.items[index].caseSlug =
                            value || undefined),
                      )
                    }
                  />
                  <VisualEditor
                    block={item}
                    imageGuide={imageGuides.selected}
                    onChange={(patch) =>
                      update((d) =>
                        Object.assign(d.selectedWorks.items[index], patch),
                      )
                    }
                  />
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) =>
                    d.selectedWorks.items.push({
                      title: "新案例",
                      en: "Case",
                      caseSlug: d.caseStudies[0]?.slug,
                    }),
                  )
                }
              >
                添加精选案例
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "cases" && (
          <Panel
            title="Case Studies 案例详情"
            intro="管理详情案例页：主图、说明、缩略图都可以替换。"
          >
            <Stack>
              {content.caseStudies.map((item, caseIndex) => (
                <EditableCard
                  key={`${item.no}-${caseIndex}`}
                  title={`案例 ${caseIndex + 1}`}
                  onRemove={() =>
                    update((d) => d.caseStudies.splice(caseIndex, 1))
                  }
                  onMoveUp={() =>
                    update((d) => move(d.caseStudies, caseIndex, caseIndex - 1))
                  }
                  onMoveDown={() =>
                    update((d) => move(d.caseStudies, caseIndex, caseIndex + 1))
                  }
                >
                  <Grid>
                    <Field
                      label="编号"
                      value={item.no}
                      onChange={(value) =>
                        update(
                          (d) => void (d.caseStudies[caseIndex].no = value),
                        )
                      }
                    />
                    <Field
                      label="标题"
                      value={item.title}
                      onChange={(value) =>
                        update(
                          (d) => void (d.caseStudies[caseIndex].title = value),
                        )
                      }
                    />
                  </Grid>
                  <Grid>
                    <Field
                      label="详情页路径 slug"
                      value={item.slug}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.caseStudies[caseIndex].slug =
                              slugify(value)),
                        )
                      }
                    />
                    <Field
                      label="行业"
                      value={item.industry}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.caseStudies[caseIndex].industry = value),
                        )
                      }
                    />
                  </Grid>
                  <Grid>
                    <Field
                      label="案例类型"
                      value={item.category ?? ""}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.caseStudies[caseIndex].category =
                              value || undefined),
                        )
                      }
                    />
                    <Field
                      label="年份"
                      value={item.year ?? ""}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.caseStudies[caseIndex].year =
                              value || undefined),
                        )
                      }
                    />
                  </Grid>
                  <Field
                    label="英文/类型"
                    value={item.en}
                    onChange={(value) =>
                      update((d) => void (d.caseStudies[caseIndex].en = value))
                    }
                  />
                  <TextArea
                    label="作品简介"
                    value={item.summary}
                    onChange={(value) =>
                      update(
                        (d) => void (d.caseStudies[caseIndex].summary = value),
                      )
                    }
                  />
                  <TextArea
                    label="详细介绍"
                    value={item.description}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].description = value),
                      )
                    }
                  />
                  <TextArea
                    label="项目目标"
                    value={item.challenge ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].challenge =
                            value || undefined),
                      )
                    }
                  />
                  <TextArea
                    label="视觉策略"
                    value={item.strategy ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].strategy =
                            value || undefined),
                      )
                    }
                  />
                  <TextArea
                    label="制作流程"
                    value={item.solution ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].solution =
                            value || undefined),
                      )
                    }
                  />
                  <TextArea
                    label="成果展示"
                    value={item.result ?? ""}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].result =
                            value || undefined),
                      )
                    }
                  />
                  <TextArea
                    label="服务内容（每行一个）"
                    value={(item.services ?? []).join("\n")}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].services =
                            lines(value)),
                      )
                    }
                  />
                  <ServiceRelationEditor
                    services={content.services.items}
                    value={item.serviceIds ?? []}
                    onChange={(serviceIds) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].serviceIds =
                            serviceIds),
                      )
                    }
                  />
                  <TextArea
                    label="标签（每行一个）"
                    value={item.tags.join("\n")}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].tags = lines(value)),
                      )
                    }
                  />
                  <VideoEditor
                    value={item.video}
                    fallbackUrl={item.videoUrl}
                    onChange={(video) =>
                      update(
                        (d) => void (d.caseStudies[caseIndex].video = video),
                      )
                    }
                    onFallbackChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].videoUrl =
                            value || undefined),
                      )
                    }
                  />
                  <div className="image-guide media-guide">
                    <strong>案例视频 / 动效展示</strong>
                    <small>
                      比例：16:9 横版为主，社媒短视频可在详情说明中补充 9:16
                      链接
                    </small>
                    <small>
                      推荐尺寸：1920×1080，H.264 MP4 / WebM，20-60 秒预览最稳
                    </small>
                    <small>
                      如使用 B站、网盘、Frame.io
                      等外部页面链接，前台会显示为“打开视频链接”。
                    </small>
                  </div>
                  <UploadOnly
                    label="上传作品视频"
                    accept="video/mp4,video/webm,video/quicktime"
                    onUploaded={(url) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].video = {
                            type: "local",
                            url,
                            title: "作品视频",
                          }),
                      )
                    }
                  />
                  <TextArea
                    label="前台项目信息（每行一条，仅填写客户可见内容）"
                    value={item.meta.join("\n")}
                    onChange={(value) =>
                      update(
                        (d) =>
                          void (d.caseStudies[caseIndex].meta = lines(value)),
                      )
                    }
                  />
                  <VisualEditor
                    block={item}
                    imageGuide={imageGuides.caseMain}
                    onChange={(patch) =>
                      update((d) =>
                        Object.assign(d.caseStudies[caseIndex], patch),
                      )
                    }
                  />
                  <div className="admin-sublist">
                    <h4>缩略图</h4>
                    {item.thumbs.map((thumb, thumbIndex) => (
                      <div
                        className="admin-thumb-editor"
                        key={`${caseIndex}-${thumbIndex}`}
                      >
                        <VisualEditor
                          block={thumb}
                          compact
                          imageGuide={imageGuides.caseThumb}
                          onChange={(patch) =>
                            update((d) =>
                              Object.assign(
                                d.caseStudies[caseIndex].thumbs[thumbIndex],
                                patch,
                              ),
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            update((d) =>
                              d.caseStudies[caseIndex].thumbs.splice(
                                thumbIndex,
                                1,
                              ),
                            )
                          }
                        >
                          删除缩略图
                        </button>
                      </div>
                    ))}
                    <AddButton
                      onClick={() =>
                        update((d) => d.caseStudies[caseIndex].thumbs.push({}))
                      }
                    >
                      添加缩略图
                    </AddButton>
                  </div>
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) =>
                    d.caseStudies.push({
                      no: String(d.caseStudies.length + 5).padStart(2, "0"),
                      slug: `new-case-${Date.now()}`,
                      title: "新案例",
                      en: "Case Study",
                      summary: "一句话介绍这个作品。",
                      description:
                        "在这里填写作品背景、目标、制作方式和交付内容。",
                      category: "AI 商业视觉",
                      industry: "行业",
                      year: "2026",
                      challenge: "填写项目目标。",
                      strategy: "填写视觉策略。",
                      solution: "填写制作流程。",
                      result: "填写成果展示。",
                      services: ["创意方向", "AI 视觉生成"],
                      serviceIds: ["ai-brand-film"],
                      tags: ["AI视觉"],
                      meta: ["项目类型  商业视觉"],
                      thumbs: [{}, {}],
                    }),
                  )
                }
              >
                添加案例详情
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "studio" && (
          <Panel
            title="AI Studio System AI生产系统"
            intro="展示 YITO 的 AI 商业视觉生产方法，不是工具清单。"
          >
            <SectionFields
              no={content.aiStudio?.no ?? ""}
              title={content.aiStudio?.title ?? ""}
              subtitle={content.aiStudio?.subtitle ?? ""}
              onChange={(field, value) =>
                update((d) => {
                  d.aiStudio ??= createEmptyAiStudio();
                  d.aiStudio[field] = value;
                })
              }
            />
            <TextArea
              label="正文说明"
              value={content.aiStudio?.body ?? ""}
              onChange={(value) =>
                update((d) => {
                  d.aiStudio ??= createEmptyAiStudio();
                  d.aiStudio.body = value;
                })
              }
            />
            <TextArea
              label="能力列表（每行一个）"
              value={(content.aiStudio?.items ?? []).join("\n")}
              onChange={(value) =>
                update((d) => {
                  d.aiStudio ??= createEmptyAiStudio();
                  d.aiStudio.items = lines(value);
                })
              }
            />
            <TextArea
              label="强表达句"
              value={content.aiStudio?.statement ?? ""}
              onChange={(value) =>
                update((d) => {
                  d.aiStudio ??= createEmptyAiStudio();
                  d.aiStudio.statement = value;
                })
              }
            />
            <VisualEditor
              block={content.aiStudio ?? createEmptyAiStudio()}
              imageGuide={imageGuides.wide}
              onChange={(patch) =>
                update((d) => {
                  d.aiStudio ??= createEmptyAiStudio();
                  Object.assign(d.aiStudio, patch);
                })
              }
            />
          </Panel>
        )}

        {active === "process" && (
          <Panel title="Process 流程" intro="修改流程标题和每一步说明。">
            <SectionFields
              no={content.process.no}
              title={content.process.title}
              subtitle={content.process.subtitle}
              onChange={(field, value) =>
                update(
                  (d) =>
                    void ((d.process as unknown as Record<string, string>)[
                      field
                    ] = value),
                )
              }
            />
            <TextArea
              label="模块说明"
              value={content.process.intro ?? ""}
              onChange={(value) =>
                update((d) => void (d.process.intro = value))
              }
            />
            <Stack>
              {content.process.steps.map((step, index) => (
                <EditableCard
                  key={`${step.title}-${index}`}
                  title={`步骤 ${index + 1}`}
                  onRemove={() =>
                    update((d) => d.process.steps.splice(index, 1))
                  }
                  onMoveUp={() =>
                    update((d) => move(d.process.steps, index, index - 1))
                  }
                  onMoveDown={() =>
                    update((d) => move(d.process.steps, index, index + 1))
                  }
                >
                  <Grid>
                    <Field
                      label="步骤名称"
                      value={step.title}
                      onChange={(value) =>
                        update(
                          (d) => void (d.process.steps[index].title = value),
                        )
                      }
                    />
                    <Field
                      label="英文名称"
                      value={step.en ?? ""}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.process.steps[index].en =
                              value || undefined),
                        )
                      }
                    />
                  </Grid>
                  <Field
                    label="步骤说明"
                    value={step.detail}
                    onChange={(value) =>
                      update(
                        (d) => void (d.process.steps[index].detail = value),
                      )
                    }
                  />
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) =>
                    d.process.steps.push({
                      title: "新步骤",
                      en: "Step",
                      detail: "步骤说明",
                    }),
                  )
                }
              >
                添加流程步骤
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "why" && (
          <Panel title="Why Choose 选择理由" intro="修改优势卡片。">
            <SectionFields
              no={content.why.no}
              title={content.why.title}
              subtitle={content.why.subtitle}
              onChange={(field, value) =>
                update(
                  (d) =>
                    void ((d.why as unknown as Record<string, string>)[field] =
                      value),
                )
              }
            />
            <TextArea
              label="模块说明"
              value={content.why.intro ?? ""}
              onChange={(value) => update((d) => void (d.why.intro = value))}
            />
            <Stack>
              {content.why.items.map((item, index) => (
                <EditableCard
                  key={`${item.title}-${index}`}
                  title={`优势 ${index + 1}`}
                  onRemove={() => update((d) => d.why.items.splice(index, 1))}
                  onMoveUp={() =>
                    update((d) => move(d.why.items, index, index - 1))
                  }
                  onMoveDown={() =>
                    update((d) => move(d.why.items, index, index + 1))
                  }
                >
                  <Grid>
                    <Field
                      label="标题"
                      value={item.title}
                      onChange={(value) =>
                        update((d) => void (d.why.items[index].title = value))
                      }
                    />
                    <SelectField
                      label="图标"
                      value={item.icon}
                      options={iconOptions}
                      onChange={(value) =>
                        update(
                          (d) =>
                            void (d.why.items[index].icon = value as IconName),
                        )
                      }
                    />
                  </Grid>
                  <TextArea
                    label="说明"
                    value={item.text}
                    onChange={(value) =>
                      update((d) => void (d.why.items[index].text = value))
                    }
                  />
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) =>
                    d.why.items.push({
                      title: "新优势",
                      text: "优势说明",
                      icon: "sparkles",
                    }),
                  )
                }
              >
                添加优势
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "clients" && (
          <Panel
            title="Clients & Industries 客户行业"
            intro="展示过往经验覆盖和 AI 商业视觉方向，避免堆砌客户 Logo。"
          >
            <SectionFields
              no={content.clients?.no ?? ""}
              title={content.clients?.title ?? ""}
              subtitle={content.clients?.subtitle ?? ""}
              onChange={(field, value) =>
                update((d) => {
                  d.clients ??= createEmptyClients();
                  d.clients[field] = value;
                })
              }
            />
            <TextArea
              label="模块说明"
              value={content.clients?.intro ?? ""}
              onChange={(value) =>
                update((d) => {
                  d.clients ??= createEmptyClients();
                  d.clients.intro = value;
                })
              }
            />
            <Stack>
              {(content.clients?.groups ?? []).map((group, index) => (
                <EditableCard
                  key={`${group.title}-${index}`}
                  title={`行业组 ${index + 1}`}
                  onRemove={() =>
                    update((d) => {
                      d.clients ??= createEmptyClients();
                      d.clients.groups.splice(index, 1);
                    })
                  }
                  onMoveUp={() =>
                    update((d) => {
                      d.clients ??= createEmptyClients();
                      move(d.clients.groups, index, index - 1);
                    })
                  }
                  onMoveDown={() =>
                    update((d) => {
                      d.clients ??= createEmptyClients();
                      move(d.clients.groups, index, index + 1);
                    })
                  }
                >
                  <Grid>
                    <Field
                      label="英文标题"
                      value={group.title}
                      onChange={(value) =>
                        update((d) => {
                          d.clients ??= createEmptyClients();
                          d.clients.groups[index].title = value;
                        })
                      }
                    />
                    <Field
                      label="中文标题"
                      value={group.subtitle}
                      onChange={(value) =>
                        update((d) => {
                          d.clients ??= createEmptyClients();
                          d.clients.groups[index].subtitle = value;
                        })
                      }
                    />
                  </Grid>
                  <TextArea
                    label="标签（每行一个）"
                    value={group.items.join("\n")}
                    onChange={(value) =>
                      update((d) => {
                        d.clients ??= createEmptyClients();
                        d.clients.groups[index].items = lines(value);
                      })
                    }
                  />
                </EditableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((d) => {
                    d.clients ??= createEmptyClients();
                    d.clients.groups.push({
                      title: "New Group",
                      subtitle: "新分组",
                      items: ["行业标签"],
                    });
                  })
                }
              >
                添加行业分组
              </AddButton>
            </Stack>
          </Panel>
        )}

        {active === "contact" && (
          <Panel title="Contact 联系方式" intro="修改联系方式和结尾视觉。">
            <SectionFields
              no={content.contact.no}
              title={content.contact.title}
              subtitle={content.contact.subtitle}
              onChange={(field, value) =>
                update(
                  (d) =>
                    void ((d.contact as unknown as Record<string, string>)[
                      field
                    ] = value),
                )
              }
            />
            <TextArea
              label="主文案"
              value={content.contact.intro ?? ""}
              onChange={(value) =>
                update((d) => void (d.contact.intro = value))
              }
            />
            <TextArea
              label="副文案"
              value={content.contact.note ?? ""}
              onChange={(value) => update((d) => void (d.contact.note = value))}
            />
            <Grid>
              <Field
                label="微信"
                value={content.contact.wechat}
                onChange={(value) =>
                  update((d) => void (d.contact.wechat = value))
                }
              />
              <Field
                label="邮箱"
                value={content.contact.email}
                onChange={(value) =>
                  update((d) => void (d.contact.email = value))
                }
              />
            </Grid>
            <Field
              label="小红书"
              value={content.contact.xiaohongshu}
              onChange={(value) =>
                update((d) => void (d.contact.xiaohongshu = value))
              }
            />
            <Field
              label="所在地 / 服务方式"
              value={content.contact.location ?? ""}
              onChange={(value) =>
                update((d) => void (d.contact.location = value || undefined))
              }
            />
            <Field
              label="视觉标签"
              value={content.contact.visualLabel}
              onChange={(value) =>
                update((d) => void (d.contact.visualLabel = value))
              }
            />
            <VisualEditor
              block={content.contact}
              imageGuide={imageGuides.wide}
              onChange={(patch) =>
                update((d) => Object.assign(d.contact, patch))
              }
            />
          </Panel>
        )}

        {active === "footer" && (
          <Panel title="Footer 页脚" intro="修改网站底部品牌与版权信息。">
            <Grid>
              <Field
                label="品牌"
                value={content.footer?.brand ?? ""}
                onChange={(value) =>
                  update((d) => {
                    d.footer ??= {
                      brand: "",
                      subtitle: "",
                      services: "",
                      copyright: "",
                      credit: "",
                    };
                    d.footer.brand = value;
                  })
                }
              />
              <Field
                label="副标题"
                value={content.footer?.subtitle ?? ""}
                onChange={(value) =>
                  update((d) => {
                    d.footer ??= {
                      brand: "",
                      subtitle: "",
                      services: "",
                      copyright: "",
                      credit: "",
                    };
                    d.footer.subtitle = value;
                  })
                }
              />
            </Grid>
            <Field
              label="服务短句"
              value={content.footer?.services ?? ""}
              onChange={(value) =>
                update((d) => {
                  d.footer ??= {
                    brand: "",
                    subtitle: "",
                    services: "",
                    copyright: "",
                    credit: "",
                  };
                  d.footer.services = value;
                })
              }
            />
            <Grid>
              <Field
                label="版权"
                value={content.footer?.copyright ?? ""}
                onChange={(value) =>
                  update((d) => {
                    d.footer ??= {
                      brand: "",
                      subtitle: "",
                      services: "",
                      copyright: "",
                      credit: "",
                    };
                    d.footer.copyright = value;
                  })
                }
              />
              <Field
                label="制作说明"
                value={content.footer?.credit ?? ""}
                onChange={(value) =>
                  update((d) => {
                    d.footer ??= {
                      brand: "",
                      subtitle: "",
                      services: "",
                      copyright: "",
                      credit: "",
                    };
                    d.footer.credit = value;
                  })
                }
              />
            </Grid>
          </Panel>
        )}

        {active === "advanced" && (
          <Panel
            title="高级 JSON 编辑"
            intro="适合批量复制、备份、迁移。请谨慎修改结构字段。"
          >
            <textarea
              className="json-editor"
              value={advancedJson}
              onChange={(event) => setAdvancedJson(event.target.value)}
            />
            <div className="admin-actions">
              <button onClick={applyJson}>应用 JSON 到编辑器</button>
              <button onClick={save}>保存 JSON 内容</button>
            </div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function Panel({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="admin-form">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="admin-grid">{children}</div>;
}

function Stack({ children }: { children: React.ReactNode }) {
  return <div className="admin-stack">{children}</div>;
}

type EditableService = SiteContent["services"]["items"][number];

function serviceOptionId(service: EditableService, index: number) {
  return (
    service.id || slugify(service.en || service.title || `service-${index + 1}`)
  );
}

function ServiceRelationEditor({
  services,
  value,
  onChange,
}: {
  services: EditableService[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    );
  }

  return (
    <div className="admin-choice-group">
      <span>关联服务（决定首页服务章节自动展示哪些案例）</span>
      <div>
        {services.map((service, index) => {
          const id = serviceOptionId(service, index);
          return (
            <label key={id}>
              <input
                type="checkbox"
                checked={value.includes(id)}
                onChange={() => toggle(id)}
              />
              {service.title}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function VideoEditor({
  value,
  fallbackUrl,
  onChange,
  onFallbackChange,
}: {
  value?: WorkVideo;
  fallbackUrl?: string;
  onChange: (value: WorkVideo | undefined) => void;
  onFallbackChange: (value: string) => void;
}) {
  const video = value ?? {
    type: "external",
    url: fallbackUrl ?? "",
    title: "",
    embedUrl: "",
  };

  function patch(patchValue: Partial<WorkVideo>) {
    const next = { ...video, ...patchValue };
    onChange(next.url ? next : undefined);
  }

  return (
    <div className="admin-video-editor">
      <Grid>
        <SelectField
          label="视频类型"
          value={video.type}
          options={["bilibili", "external", "local"]}
          onChange={(type) => patch({ type: type as WorkVideo["type"] })}
        />
        <Field
          label="视频标题（可选）"
          value={video.title ?? ""}
          onChange={(title) => patch({ title: title || undefined })}
        />
      </Grid>
      <Field
        label="视频 URL（B站页面 / 外链 / 本地 mp4）"
        value={video.url}
        onChange={(url) => patch({ url })}
      />
      <Field
        label="B站 embed 地址（可选，有则站内 iframe 播放）"
        value={video.embedUrl ?? ""}
        onChange={(embedUrl) => patch({ embedUrl: embedUrl || undefined })}
      />
      <Field
        label="兼容旧视频地址 videoUrl（旧数据可保留，不建议新填）"
        value={fallbackUrl ?? ""}
        onChange={onFallbackChange}
      />
    </div>
  );
}

function ScrollWorldSceneEditor({
  scenes,
  services,
  onChange,
}: {
  scenes: ScrollWorldScene[];
  services: EditableService[];
  onChange: (scenes: ScrollWorldScene[]) => void;
}) {
  const serviceOptions = [
    "",
    ...services.map((service, index) => serviceOptionId(service, index)),
  ];

  function patch(index: number, patchValue: Partial<ScrollWorldScene>) {
    onChange(
      scenes.map((scene, sceneIndex) =>
        sceneIndex === index ? { ...scene, ...patchValue } : scene,
      ),
    );
  }

  return (
    <div className="admin-sublist">
      <h4>Scroll World 六个场景</h4>
      {scenes.map((scene, index) => (
        <EditableCard
          key={`${scene.id}-${index}`}
          title={`场景 ${index + 1}`}
          onRemove={() =>
            onChange(scenes.filter((_, itemIndex) => itemIndex !== index))
          }
          onMoveUp={() => onChange(moveCopy(scenes, index, index - 1))}
          onMoveDown={() => onChange(moveCopy(scenes, index, index + 1))}
        >
          <Grid>
            <Field
              label="场景编号"
              value={scene.no}
              onChange={(no) => patch(index, { no })}
            />
            <Field
              label="场景 ID"
              value={scene.id}
              onChange={(id) => patch(index, { id: slugify(id) })}
            />
          </Grid>
          <Grid>
            <Field
              label="场景标题"
              value={scene.title}
              onChange={(title) => patch(index, { title })}
            />
            <Field
              label="中文副标题"
              value={scene.subtitle}
              onChange={(subtitle) => patch(index, { subtitle })}
            />
          </Grid>
          <TextArea
            label="场景说明"
            value={scene.body}
            onChange={(body) => patch(index, { body })}
          />
          <SelectField
            label="关联服务（可选）"
            value={scene.serviceId ?? ""}
            options={serviceOptions}
            onChange={(serviceId) =>
              patch(index, { serviceId: serviceId || undefined })
            }
          />
          <VisualEditor
            block={{ image: scene.poster }}
            imageGuide={imageGuides.scrollPoster}
            onChange={(visual) => patch(index, { poster: visual.image })}
          />
        </EditableCard>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...scenes,
            {
              id: `scene-${Date.now()}`,
              no: String(scenes.length + 1).padStart(2, "0"),
              title: "新场景",
              subtitle: "场景说明",
              body: "填写滚动章节文案。",
            },
          ])
        }
      >
        添加滚动场景
      </AddButton>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionFields({
  no,
  title,
  subtitle,
  onChange,
}: {
  no: string;
  title: string;
  subtitle: string;
  onChange: (field: "no" | "title" | "subtitle", value: string) => void;
}) {
  return (
    <>
      <Grid>
        <Field
          label="章节编号"
          value={no}
          onChange={(value) => onChange("no", value)}
        />
        <Field
          label="标题"
          value={title}
          onChange={(value) => onChange("title", value)}
        />
      </Grid>
      <Field
        label="副标题"
        value={subtitle}
        onChange={(value) => onChange("subtitle", value)}
      />
    </>
  );
}

function VisualEditor({
  block,
  compact,
  imageGuide,
  onChange,
}: {
  block: VisualBlock;
  compact?: boolean;
  imageGuide: ImageGuide;
  onChange: (patch: Partial<VisualBlock>) => void;
}) {
  const [uploadStatus, setUploadStatus] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("正在上传图片...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setUploadStatus(result.error || "上传失败，请检查服务器日志");
      return;
    }

    const canPreview = await isAssetReachable(result.url);
    onChange({ image: result.url });
    setUploadStatus(
      canPreview
        ? "图片已上传，预览可访问；点击保存并发布后前台生效"
        : "图片已上传但 URL 暂不可访问，请检查 /uploads 静态目录配置",
    );
  }

  return (
    <div className={compact ? "visual-editor is-compact" : "visual-editor"}>
      <Field
        label="图片 URL"
        value={block.image ?? ""}
        onChange={(value) => onChange({ image: value || undefined })}
      />
      <label className="upload-field">
        <span>上传图片</span>
        <div className="image-guide">
          <strong>{imageGuide.usage}</strong>
          <small>比例：{imageGuide.ratio}</small>
          <small>推荐尺寸：{imageGuide.size}</small>
          <small>{imageGuide.note}</small>
        </div>
        <input type="file" accept="image/*" onChange={upload} />
      </label>
      {uploadStatus ? <p className="upload-status">{uploadStatus}</p> : null}
      {block.image ? (
        <div className="admin-preview">
          <ImageWithFallback
            src={block.image}
            alt="后台图片预览"
            className="admin-preview-image"
            sizes="320px"
          />
          <button onClick={() => onChange({ image: undefined })}>
            移除图片
          </button>
        </div>
      ) : null}
    </div>
  );
}

function EditableCard({
  title,
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  title: string;
  children: React.ReactNode;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <article className="editable-card">
      <header>
        <h3>{title}</h3>
        <div>
          <button onClick={onMoveUp}>上移</button>
          <button onClick={onMoveDown}>下移</button>
          <button onClick={onRemove}>删除</button>
        </div>
      </header>
      {children}
    </article>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="add-button" onClick={onClick}>
      {children}
    </button>
  );
}

function UploadOnly({
  label,
  accept,
  onUploaded,
}: {
  label: string;
  accept: string;
  onUploaded: (url: string) => void;
}) {
  const [uploadStatus, setUploadStatus] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("正在上传文件...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setUploadStatus(result.error || "上传失败，请检查服务器日志");
      return;
    }

    const canPreview = await isAssetReachable(result.url);
    onUploaded(result.url);
    setUploadStatus(
      canPreview
        ? "文件已上传，URL 可访问；点击保存并发布后前台生效"
        : "文件已上传但 URL 暂不可访问，请检查 /uploads 静态目录配置",
    );
  }

  return (
    <div>
      <label className="upload-field standalone-upload">
        <span>{label}</span>
        <input type="file" accept={accept} onChange={upload} />
      </label>
      {uploadStatus ? <p className="upload-status">{uploadStatus}</p> : null}
    </div>
  );
}

async function isAssetReachable(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return;
  const [item] = items.splice(from, 1);
  items.splice(to, 0, item);
}

function moveCopy<T>(items: T[], from: number, to: number) {
  const next = [...items];
  move(next, from, to);
  return next;
}

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "work"
  );
}

function createEmptyAiStudio(): NonNullable<SiteContent["aiStudio"]> {
  return {
    no: "05",
    title: "AI Studio System",
    subtitle: "AI 商业视觉生产系统",
    body: "填写 AI 商业视觉生产系统说明。",
    items: ["AI 创意方向生成", "AI 静态视觉生成"],
    statement: "AI 是工具，导演判断才是价值。",
  };
}

function createEmptyScrollWorld(): NonNullable<SiteContent["scrollWorld"]> {
  return {
    enabled: false,
    desktopVideo: "/videos/scroll-world/yito-hero-720p.mp4",
    mobileVideo: "",
    poster: "/images/scroll-world/yito-hero-poster.jpg",
    introTitle: "YITO Scroll World",
    introSubtitle: "滚动穿越 AI 商业视觉世界",
    fallbackMode: "poster",
    scenes: defaultScrollWorldScenes(),
  };
}

function defaultScrollWorldScenes(): ScrollWorldScene[] {
  return [
    {
      id: "portal",
      no: "01",
      title: "YITO Portal",
      subtitle: "AI 原生商业视觉工作室",
      body: "进入 YITO 的电影化商业视觉世界，从品牌主张到最终交付形成连续体验。",
      poster: "/images/scroll-world/yito-hero-poster.jpg",
    },
    {
      id: "ai-brand-film",
      no: "02",
      title: "AI 品牌广告片",
      subtitle: "AI Brand Film",
      body: "为品牌发布、产品推广和社媒投放建立高质感商业影像。",
      serviceId: "ai-brand-film",
      poster: "/images/services/service-ai-brand-film.jpg",
    },
    {
      id: "ai-corporate-film",
      no: "03",
      title: "AI 企业宣传片",
      subtitle: "Corporate Film",
      body: "用科技场景、企业叙事和视觉系统表达公司形象与业务价值。",
      serviceId: "ai-corporate-film",
      poster: "/images/services/service-corporate-film.jpg",
    },
    {
      id: "ai-commercial-short-film",
      no: "04",
      title: "AI 商业短片",
      subtitle: "Commercial Short Film",
      body: "以角色、故事和镜头调度，让品牌内容具备传播叙事。",
      serviceId: "ai-commercial-short-film",
      poster: "/images/services/service-commercial-short.jpg",
    },
    {
      id: "ai-concept-visual",
      no: "05",
      title: "AI 概念视觉设计",
      subtitle: "AI Concept Visual",
      body: "快速建立活动 KV、产品概念和视觉提案方向。",
      serviceId: "ai-concept-visual",
      poster: "/images/services/service-concept-visual.jpg",
    },
    {
      id: "social-content-visual",
      no: "06",
      title: "社媒内容视觉",
      subtitle: "Social Content Visual",
      body: "构建短视频、封面海报和内容矩阵，服务小红书、抖音和视频号传播。",
      serviceId: "social-content-visual",
      poster: "/images/services/service-social-content.jpg",
    },
  ];
}

function createEmptyClients(): NonNullable<SiteContent["clients"]> {
  return {
    no: "08",
    title: "Clients & Industries",
    subtitle: "客户与行业",
    intro: "填写过往服务经验覆盖的行业与当前 AI 商业视觉方向。",
    groups: [
      {
        title: "Past Design Clients",
        subtitle: "过往设计服务客户",
        items: ["科技", "消费品牌"],
      },
      {
        title: "AI Visual Direction",
        subtitle: "AI 商业视觉方向",
        items: ["AI 品牌广告", "企业宣传片"],
      },
    ],
  };
}
